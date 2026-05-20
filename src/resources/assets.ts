/**
 * Assets resource for the SuperOps MSP API.
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Asset,
  AssetUpdateInput,
  Page,
  PageParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL selection set for an asset. Fields match the SuperOps `Asset` type.
 */
const ASSET_FRAGMENT = gql`
  fragment AssetFields on Asset {
    assetId
    name
    assetClass {
      classId
      name
    }
    client {
      accountId
      name
    }
    site {
      id
      name
    }
    requester {
      userId
      name
    }
    primaryMac
    loggedInUser
    serialNumber
    manufacturer
    model
    hostName
    publicIp
    gateway
    platform
    domain
    status
    sysUptime
    lastCommunicatedTime
    agentVersion
    platformFamily
    platformCategory
    platformVersion
    patchStatus
    warrantyExpiryDate
    purchasedDate
    lastReportedTime
    customFields
  }
`;

interface GetAssetResponse {
  getAsset: Asset;
}

interface GetAssetListResponse {
  getAssetList: {
    assets: Asset[];
    listInfo: {
      page: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

interface UpdateAssetResponse {
  updateAsset: Asset;
}

/**
 * Assets resource class.
 */
export class AssetsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single asset by its asset ID.
   */
  async get(assetId: string): Promise<Asset> {
    const query = gql`
      ${ASSET_FRAGMENT}
      query GetAsset($input: AssetIdentifierInput!) {
        getAsset(input: $input) {
          ...AssetFields
        }
      }
    `;

    const result = await this.client.query<GetAssetResponse>(query, {
      input: { assetId },
    });
    return result.getAsset;
  }

  /**
   * List assets, one page at a time.
   */
  async list(params?: PageParams): Promise<Page<Asset>> {
    const query = gql`
      ${ASSET_FRAGMENT}
      query GetAssetList($input: ListInfoInput!) {
        getAssetList(input: $input) {
          assets {
            ...AssetFields
          }
          listInfo {
            page
            pageSize
            totalCount
          }
        }
      }
    `;

    const result = await this.client.query<GetAssetListResponse>(query, {
      input: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });

    return {
      items: result.getAssetList.assets,
      meta: result.getAssetList.listInfo,
    };
  }

  /**
   * Iterate every asset, fetching pages on demand.
   */
  listAll(params?: { pageSize?: number }): AsyncIterableWithHelpers<Asset> {
    return this.createPageListIterator<Asset>((p) => this.list(p), params?.pageSize);
  }

  /**
   * Update an asset's custom fields.
   */
  async update(assetId: string, input: AssetUpdateInput): Promise<Asset> {
    const mutation = gql`
      ${ASSET_FRAGMENT}
      mutation UpdateAsset($input: UpdateAssetInput!) {
        updateAsset(input: $input) {
          ...AssetFields
        }
      }
    `;

    const result = await this.client.mutate<UpdateAssetResponse>(mutation, {
      input: { assetId, ...input },
    });
    return result.updateAsset;
  }
}
