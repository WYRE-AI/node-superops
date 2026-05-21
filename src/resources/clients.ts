/**
 * Clients resource for the SuperOps MSP API.
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Client,
  ClientCreateInput,
  ClientUpdateInput,
  Page,
  PageParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL selection set for a client. Fields match the SuperOps `Client` type.
 */
const CLIENT_FRAGMENT = gql`
  fragment ClientFields on Client {
    accountId
    name
    stage
    status
    emailDomains
    accountManager {
      userId
      name
    }
    primaryContact {
      userId
      name
    }
    secondaryContact {
      userId
      name
    }
    hqSite {
      id
      name
    }
    technicianGroups {
      id
      name
    }
    customFields
  }
`;

interface GetClientResponse {
  getClient: Client;
}

interface GetClientListResponse {
  getClientList: {
    clients: Client[];
    listInfo: {
      page: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

interface CreateClientResponse {
  createClientV2: Client;
}

interface UpdateClientResponse {
  updateClient: Client;
}

/**
 * Clients resource class.
 */
export class ClientsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single client by its account ID.
   */
  async get(accountId: string): Promise<Client> {
    const query = gql`
      ${CLIENT_FRAGMENT}
      query GetClient($input: ClientIdentifierInput!) {
        getClient(input: $input) {
          ...ClientFields
        }
      }
    `;

    const result = await this.client.query<GetClientResponse>(query, {
      input: { accountId },
    });
    return result.getClient;
  }

  /**
   * List clients, one page at a time.
   */
  async list(params?: PageParams): Promise<Page<Client>> {
    const query = gql`
      ${CLIENT_FRAGMENT}
      query GetClientList($input: ListInfoInput!) {
        getClientList(input: $input) {
          clients {
            ...ClientFields
          }
          listInfo {
            page
            pageSize
            totalCount
          }
        }
      }
    `;

    const result = await this.client.query<GetClientListResponse>(query, {
      input: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });

    return {
      items: result.getClientList.clients,
      meta: result.getClientList.listInfo,
    };
  }

  /**
   * Iterate every client, fetching pages on demand.
   */
  listAll(params?: { pageSize?: number }): AsyncIterableWithHelpers<Client> {
    return this.createPageListIterator<Client>((p) => this.list(p), params?.pageSize);
  }

  /**
   * Create a new client.
   */
  async create(input: ClientCreateInput): Promise<Client> {
    const mutation = gql`
      ${CLIENT_FRAGMENT}
      mutation CreateClientV2($input: CreateClientInputV2!) {
        createClientV2(input: $input) {
          ...ClientFields
        }
      }
    `;

    const result = await this.client.mutate<CreateClientResponse>(mutation, {
      input,
    });
    return result.createClientV2;
  }

  /**
   * Update an existing client.
   */
  async update(accountId: string, input: ClientUpdateInput): Promise<Client> {
    const mutation = gql`
      ${CLIENT_FRAGMENT}
      mutation UpdateClient($input: UpdateClientInput!) {
        updateClient(input: $input) {
          ...ClientFields
        }
      }
    `;

    const result = await this.client.mutate<UpdateClientResponse>(mutation, {
      input: { accountId, ...input },
    });
    return result.updateClient;
  }
}
