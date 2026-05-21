/**
 * Tickets resource for the SuperOps MSP API.
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Ticket,
  TicketCreateInput,
  TicketUpdateInput,
  Page,
  PageParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL selection set for a ticket. Fields match the SuperOps `Ticket` type.
 */
const TICKET_FRAGMENT = gql`
  fragment TicketFields on Ticket {
    ticketId
    displayId
    subject
    ticketType
    requestType
    source
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
      email
    }
    additionalRequester {
      userId
      name
      email
    }
    followers
    techGroup {
      id
      name
    }
    technician {
      userId
      name
      email
    }
    status
    priority
    impact
    urgency
    category
    subcategory
    cause
    subcause
    resolutionCode
    sla {
      id
      name
    }
    createdTime
    updatedTime
    firstResponseDueTime
    firstResponseTime
    firstResponseViolated
    resolutionDueTime
    resolutionTime
    resolutionViolated
    customFields
    worklogTimespent
  }
`;

interface GetTicketResponse {
  getTicket: Ticket;
}

interface GetTicketListResponse {
  getTicketList: {
    tickets: Ticket[];
    listInfo: {
      page: number;
      pageSize: number;
      totalCount: number;
    };
  };
}

interface CreateTicketResponse {
  createTicket: Ticket;
}

interface UpdateTicketResponse {
  updateTicket: Ticket;
}

/**
 * Tickets resource class.
 */
export class TicketsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single ticket by its ticket ID.
   */
  async get(ticketId: string): Promise<Ticket> {
    const query = gql`
      ${TICKET_FRAGMENT}
      query GetTicket($input: TicketIdentifierInput!) {
        getTicket(input: $input) {
          ...TicketFields
        }
      }
    `;

    const result = await this.client.query<GetTicketResponse>(query, {
      input: { ticketId },
    });
    return result.getTicket;
  }

  /**
   * List tickets, one page at a time.
   */
  async list(params?: PageParams): Promise<Page<Ticket>> {
    const query = gql`
      ${TICKET_FRAGMENT}
      query GetTicketList($input: ListInfoInput!) {
        getTicketList(input: $input) {
          tickets {
            ...TicketFields
          }
          listInfo {
            page
            pageSize
            totalCount
          }
        }
      }
    `;

    const result = await this.client.query<GetTicketListResponse>(query, {
      input: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });

    return {
      items: result.getTicketList.tickets,
      meta: result.getTicketList.listInfo,
    };
  }

  /**
   * Iterate every ticket, fetching pages on demand.
   */
  listAll(params?: { pageSize?: number }): AsyncIterableWithHelpers<Ticket> {
    return this.createPageListIterator<Ticket>((p) => this.list(p), params?.pageSize);
  }

  /**
   * Create a new ticket.
   */
  async create(input: TicketCreateInput): Promise<Ticket> {
    const mutation = gql`
      ${TICKET_FRAGMENT}
      mutation CreateTicket($input: CreateTicketInput!) {
        createTicket(input: $input) {
          ...TicketFields
        }
      }
    `;

    const result = await this.client.mutate<CreateTicketResponse>(mutation, {
      input,
    });
    return result.createTicket;
  }

  /**
   * Update an existing ticket.
   */
  async update(ticketId: string, input: TicketUpdateInput): Promise<Ticket> {
    const mutation = gql`
      ${TICKET_FRAGMENT}
      mutation UpdateTicket($input: UpdateTicketInput!) {
        updateTicket(input: $input) {
          ...TicketFields
        }
      }
    `;

    const result = await this.client.mutate<UpdateTicketResponse>(mutation, {
      input: { ticketId, ...input },
    });
    return result.updateTicket;
  }
}