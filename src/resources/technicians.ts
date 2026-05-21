/**
 * Technicians resource for the SuperOps MSP API.
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Technician,
  TechnicianCreateInput,
  TechnicianUpdateInput,
  Page,
  PageParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL selection set for a technician. Fields match the SuperOps `Technician` type.
 * NOTE: Some field names are unverified against live API and based on common patterns.
 */
const TECHNICIAN_FRAGMENT = gql`
  fragment TechnicianFields on Technician {
    userId
    firstName
    lastName
    email
    phoneNumber
    role {
      roleId
      name
    }
    status
    isActive
    department
    jobTitle
    timeZone
    groups {
      groupId
      name
    }
    createdDate
    modifiedDate
  }
`;

interface GetTechnicianListResponse {
  getTechnicianList: {
    technicians: Technician[];
    listInfo: {
      page: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

interface CreateTechnicianResponse {
  createTechnician: Technician;
}

interface UpdateTechnicianResponse {
  updateTechnician: Technician;
}

interface DeleteTechnicianResponse {
  deleteTechnician: boolean;
}

/**
 * Technicians resource class.
 */
export class TechniciansResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * List technicians, one page at a time.
   */
  async list(params?: PageParams): Promise<Page<Technician>> {
    const query = gql`
      ${TECHNICIAN_FRAGMENT}
      query GetTechnicianList($input: ListInfoInput!) {
        getTechnicianList(input: $input) {
          technicians {
            ...TechnicianFields
          }
          listInfo {
            page
            pageSize
            totalCount
          }
        }
      }
    `;

    const result = await this.client.query<GetTechnicianListResponse>(query, {
      input: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });

    return {
      items: result.getTechnicianList.technicians,
      meta: result.getTechnicianList.listInfo,
    };
  }

  /**
   * Iterate every technician, fetching pages on demand.
   */
  listAll(params?: { pageSize?: number }): AsyncIterableWithHelpers<Technician> {
    return this.createPageListIterator<Technician>((p) => this.list(p), params?.pageSize);
  }

  /**
   * Create a new technician.
   */
  async create(input: TechnicianCreateInput): Promise<Technician> {
    const mutation = gql`
      ${TECHNICIAN_FRAGMENT}
      mutation CreateTechnician($input: CreateTechnicianInput!) {
        createTechnician(input: $input) {
          ...TechnicianFields
        }
      }
    `;

    const result = await this.client.mutate<CreateTechnicianResponse>(mutation, {
      input,
    });
    return result.createTechnician;
  }

  /**
   * Update an existing technician.
   */
  async update(input: TechnicianUpdateInput): Promise<Technician> {
    const mutation = gql`
      ${TECHNICIAN_FRAGMENT}
      mutation UpdateTechnician($input: UpdateTechnicianInput!) {
        updateTechnician(input: $input) {
          ...TechnicianFields
        }
      }
    `;

    const result = await this.client.mutate<UpdateTechnicianResponse>(mutation, {
      input,
    });
    return result.updateTechnician;
  }

  /**
   * Delete a technician.
   */
  async delete(userId: string): Promise<boolean> {
    const mutation = gql`
      mutation DeleteTechnician($input: DeleteUserInput!) {
        deleteTechnician(input: $input)
      }
    `;

    const result = await this.client.mutate<DeleteTechnicianResponse>(mutation, {
      input: { userId },
    });
    return result.deleteTechnician;
  }
}
