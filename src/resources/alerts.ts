/**
 * Alerts resource for the SuperOps MSP API.
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Alert,
  AlertCreateInput,
  AlertResolveInput,
  Page,
  PageParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL selection set for an alert. Fields match the SuperOps `Alert` type.
 */
const ALERT_FRAGMENT = gql`
  fragment AlertFields on Alert {
    id
    message
    description
    severity
    status
    createdTime
    resolvedTime
    asset {
      assetId
      name
    }
    policy {
      id
      name
    }
  }
`;

interface GetAlertListResponse {
  getAlertList: {
    alerts: Alert[];
    listInfo: {
      page: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

interface GetAlertsForAssetResponse {
  getAlertsForAsset: {
    alerts: Alert[];
    listInfo: {
      page: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

interface CreateAlertResponse {
  createAlert: Alert;
}

interface ResolveAlertsResponse {
  resolveAlerts: Alert[];
}

/**
 * Alerts resource class.
 */
export class AlertsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * List alerts, one page at a time.
   */
  async list(params?: PageParams): Promise<Page<Alert>> {
    const query = gql`
      ${ALERT_FRAGMENT}
      query GetAlertList($input: ListInfoInput!) {
        getAlertList(input: $input) {
          alerts {
            ...AlertFields
          }
          listInfo {
            page
            pageSize
            totalCount
          }
        }
      }
    `;

    const result = await this.client.query<GetAlertListResponse>(query, {
      input: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });

    return {
      items: result.getAlertList.alerts,
      meta: result.getAlertList.listInfo,
    };
  }

  /**
   * Iterate every alert, fetching pages on demand.
   */
  listAll(params?: { pageSize?: number }): AsyncIterableWithHelpers<Alert> {
    return this.createPageListIterator<Alert>((p) => this.list(p), params?.pageSize);
  }

  /**
   * List alerts for a specific asset.
   */
  async listByAsset(assetId: string, params?: PageParams): Promise<Page<Alert>> {
    const query = gql`
      ${ALERT_FRAGMENT}
      query GetAlertsForAsset($input: AssetDetailsListInput!) {
        getAlertsForAsset(input: $input) {
          alerts {
            ...AlertFields
          }
          listInfo {
            page
            pageSize
            totalCount
          }
        }
      }
    `;

    const result = await this.client.query<GetAlertsForAssetResponse>(query, {
      input: {
        assetId,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });

    return {
      items: result.getAlertsForAsset.alerts,
      meta: result.getAlertsForAsset.listInfo,
    };
  }

  /**
   * Create a new alert.
   */
  async create(input: AlertCreateInput): Promise<Alert> {
    const mutation = gql`
      ${ALERT_FRAGMENT}
      mutation CreateAlert($input: CreateAlertInput!) {
        createAlert(input: $input) {
          ...AlertFields
        }
      }
    `;

    const result = await this.client.mutate<CreateAlertResponse>(mutation, {
      input,
    });
    return result.createAlert;
  }

  /**
   * Resolve one or more alerts.
   */
  async resolve(input: AlertResolveInput): Promise<Alert[]> {
    const mutation = gql`
      ${ALERT_FRAGMENT}
      mutation ResolveAlerts($input: ResolveAlertInput!) {
        resolveAlerts(input: $input) {
          ...AlertFields
        }
      }
    `;

    const result = await this.client.mutate<ResolveAlertsResponse>(mutation, {
      input,
    });
    return result.resolveAlerts;
  }
}
