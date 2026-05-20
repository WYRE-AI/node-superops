/**
 * Contracts resource for the SuperOps MSP API.
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Contract,
  ContractCreateInput,
  ContractUpdateInput,
  Page,
  PageParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL selection set for a client contract. Fields match the SuperOps `ClientContract` type.
 */
const CONTRACT_FRAGMENT = gql`
  fragment ContractFields on ClientContract {
    contractId
    client {
      accountId
      name
    }
    contract {
      name
      description
      startDate
      endDate
      contractStatus
      contractValue
      currency
      billingCycle
      autoRenew
      customFields
    }
    startDate
    endDate
    contractStatus
  }
`;

interface GetClientContractResponse {
  getClientContract: Contract;
}

interface GetClientContractListResponse {
  getClientContractList: {
    clientContracts: Contract[];
    listInfo: {
      page: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

interface CreateClientContractResponse {
  createClientContract: string; // Returns ID
}

interface UpdateClientContractResponse {
  updateClientContract: Contract;
}

/**
 * Contracts resource class.
 */
export class ContractsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single client contract by its contract ID.
   */
  async get(contractId: number): Promise<Contract> {
    const query = gql`
      ${CONTRACT_FRAGMENT}
      query GetClientContract($input: ContractIdentifierInput!) {
        getClientContract(input: $input) {
          ...ContractFields
        }
      }
    `;

    const result = await this.client.query<GetClientContractResponse>(query, {
      input: { contractId },
    });
    return result.getClientContract;
  }

  /**
   * List client contracts, one page at a time.
   */
  async list(params?: PageParams): Promise<Page<Contract>> {
    const query = gql`
      ${CONTRACT_FRAGMENT}
      query GetClientContractList($input: ListInfoInput) {
        getClientContractList(input: $input) {
          clientContracts {
            ...ContractFields
          }
          listInfo {
            page
            pageSize
            totalCount
          }
        }
      }
    `;

    const result = await this.client.query<GetClientContractListResponse>(query, {
      input: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });

    return {
      items: result.getClientContractList.clientContracts,
      meta: result.getClientContractList.listInfo,
    };
  }

  /**
   * Iterate every client contract, fetching pages on demand.
   */
  listAll(params?: { pageSize?: number }): AsyncIterableWithHelpers<Contract> {
    return this.createPageListIterator<Contract>((p) => this.list(p), params?.pageSize);
  }

  /**
   * Create a new client contract.
   */
  async create(input: ContractCreateInput): Promise<string> {
    const mutation = gql`
      mutation CreateClientContract($input: CreateClientContractInput!) {
        createClientContract(input: $input)
      }
    `;

    const result = await this.client.mutate<CreateClientContractResponse>(mutation, {
      input,
    });
    return result.createClientContract;
  }

  /**
   * Update an existing client contract.
   */
  async update(contractId: number, input: ContractUpdateInput): Promise<Contract> {
    const mutation = gql`
      ${CONTRACT_FRAGMENT}
      mutation UpdateClientContract($input: UpdateClientContractInput!) {
        updateClientContract(input: $input) {
          ...ContractFields
        }
      }
    `;

    const result = await this.client.mutate<UpdateClientContractResponse>(mutation, {
      input: { contractId, ...input },
    });
    return result.updateClientContract;
  }
}