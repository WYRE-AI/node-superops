/**
 * Sites resource for the SuperOps MSP API.
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Site,
  SiteCreateInput,
  SiteUpdateInput,
  Page,
  PageParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL selection set for a client site. Fields match the SuperOps `ClientSite` type.
 */
const SITE_FRAGMENT = gql`
  fragment ClientSiteFields on ClientSite {
    id
    name
    timezoneCode
    working24x7
    businessHour {
      dayOfWeek
      startTime
      endTime
      isWorkingDay
    }
    holidayList {
      id
      name
    }
    line1
    line2
    line3
    city
    postalCode
    countryCode
    stateCode
    contactNumber
    client {
      id
      name
    }
    hq
    installerInfo {
      id
      name
      contactNumber
    }
  }
`;

interface GetClientSiteResponse {
  getClientSite: Site;
}

interface GetClientSiteListResponse {
  getClientSiteList: {
    clientSites: Site[];
    listInfo: {
      page: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

interface CreateClientSiteResponse {
  createClientSite: Site;
}

interface UpdateClientSiteResponse {
  updateClientSite: Site;
}

/**
 * Sites resource class.
 */
export class SitesResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single client site by its site ID.
   */
  async get(siteId: string): Promise<Site> {
    const query = gql`
      ${SITE_FRAGMENT}
      query GetClientSite($input: ClientSiteIdentifierInput!) {
        getClientSite(input: $input) {
          ...ClientSiteFields
        }
      }
    `;

    const result = await this.client.query<GetClientSiteResponse>(query, {
      input: { siteId },
    });
    return result.getClientSite;
  }

  /**
   * List client sites, one page at a time.
   */
  async list(params?: PageParams): Promise<Page<Site>> {
    const query = gql`
      ${SITE_FRAGMENT}
      query GetClientSiteList($input: GetClientSiteListInput!) {
        getClientSiteList(input: $input) {
          clientSites {
            ...ClientSiteFields
          }
          listInfo {
            page
            pageSize
            totalCount
          }
        }
      }
    `;

    const result = await this.client.query<GetClientSiteListResponse>(query, {
      input: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });

    return {
      items: result.getClientSiteList.clientSites,
      meta: result.getClientSiteList.listInfo,
    };
  }

  /**
   * Iterate every client site, fetching pages on demand.
   */
  listAll(params?: { pageSize?: number }): AsyncIterableWithHelpers<Site> {
    return this.createPageListIterator<Site>((p) => this.list(p), params?.pageSize);
  }

  /**
   * Create a new client site.
   */
  async create(input: SiteCreateInput): Promise<Site> {
    const mutation = gql`
      ${SITE_FRAGMENT}
      mutation CreateClientSite($input: CreateClientSiteInput!) {
        createClientSite(input: $input) {
          ...ClientSiteFields
        }
      }
    `;

    const result = await this.client.mutate<CreateClientSiteResponse>(mutation, {
      input,
    });
    return result.createClientSite;
  }

  /**
   * Update an existing client site.
   */
  async update(siteId: string, input: SiteUpdateInput): Promise<Site> {
    const mutation = gql`
      ${SITE_FRAGMENT}
      mutation UpdateClientSite($input: UpdateClientSiteInput!) {
        updateClientSite(input: $input) {
          ...ClientSiteFields
        }
      }
    `;

    const result = await this.client.mutate<UpdateClientSiteResponse>(mutation, {
      input: { siteId, ...input },
    });
    return result.updateClientSite;
  }
}
