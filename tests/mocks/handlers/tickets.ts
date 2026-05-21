/**
 * MSW handlers for the SuperOps Tickets API.
 */

import { HttpResponse } from 'msw';
import { superopsApi, checkAuth, authenticationError, notFoundError } from '../shared.js';

/** Sample ticket data. Shape matches the SuperOps `Ticket` GraphQL type. */
const sampleTicket = {
  ticketId: 'ticket-123',
  displayId: 'T-001',
  subject: 'Network connectivity issue',
  ticketType: 'INCIDENT',
  requestType: 'SERVICE_REQUEST',
  source: 'EMAIL',
  client: { accountId: 'client-456', name: 'Acme Corp' },
  site: { id: 'site-789', name: 'Main Office' },
  requester: { userId: 'user-1', name: 'Jane Doe', email: 'jane@acme.com' },
  additionalRequester: [],
  followers: {},
  techGroup: { id: 'group-1', name: 'Network Team' },
  technician: { userId: 'tech-1', name: 'John Smith', email: 'john@msp.com' },
  status: 'OPEN',
  priority: 'HIGH',
  impact: 'MEDIUM',
  urgency: 'HIGH',
  category: 'Network',
  subcategory: 'Connectivity',
  cause: null,
  subcause: null,
  resolutionCode: null,
  sla: { id: 'sla-1', name: 'Standard SLA' },
  createdTime: '2026-02-04T10:00:00.000Z',
  updatedTime: '2026-02-04T10:30:00.000Z',
  firstResponseDueTime: '2026-02-04T14:00:00.000Z',
  firstResponseTime: '2026-02-04T10:15:00.000Z',
  firstResponseViolated: false,
  resolutionDueTime: '2026-02-05T10:00:00.000Z',
  resolutionTime: null,
  resolutionViolated: false,
  customFields: {},
  worklogTimespent: '30 minutes',
};

const sampleTicket2 = {
  ticketId: 'ticket-456',
  displayId: 'T-002',
  subject: 'Software installation request',
  ticketType: 'SERVICE_REQUEST',
  requestType: 'SERVICE_REQUEST',
  source: 'PORTAL',
  client: { accountId: 'client-456', name: 'Acme Corp' },
  site: { id: 'site-789', name: 'Main Office' },
  requester: { userId: 'user-2', name: 'Bob Wilson', email: 'bob@acme.com' },
  additionalRequester: [],
  followers: {},
  techGroup: { id: 'group-2', name: 'Desktop Team' },
  technician: null,
  status: 'PENDING',
  priority: 'MEDIUM',
  impact: 'LOW',
  urgency: 'MEDIUM',
  category: 'Software',
  subcategory: 'Installation',
  cause: null,
  subcause: null,
  resolutionCode: null,
  sla: { id: 'sla-1', name: 'Standard SLA' },
  createdTime: '2026-02-04T11:00:00.000Z',
  updatedTime: '2026-02-04T11:00:00.000Z',
  firstResponseDueTime: '2026-02-04T15:00:00.000Z',
  firstResponseTime: null,
  firstResponseViolated: false,
  resolutionDueTime: '2026-02-06T11:00:00.000Z',
  resolutionTime: null,
  resolutionViolated: false,
  customFields: {},
  worklogTimespent: null,
};

export const ticketHandlers = [
  // Tickets - Get single
  superopsApi.query('GetTicket', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { ticketId: string } };
    if (input.ticketId === 'ticket-123') {
      return HttpResponse.json({ data: { getTicket: sampleTicket } });
    }
    return HttpResponse.json(notFoundError);
  }),

  // Tickets - List (page-based)
  superopsApi.query('GetTicketList', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { page?: number; pageSize?: number } };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 50;
    const tickets = page === 1 ? [sampleTicket, sampleTicket2] : [];

    return HttpResponse.json({
      data: {
        getTicketList: {
          tickets,
          listInfo: { page, pageSize, totalCount: 2 },
        },
      },
    });
  }),

  // Tickets - Create
  superopsApi.mutation('CreateTicket', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { subject: string; [key: string]: unknown };
    };

    return HttpResponse.json({
      data: {
        createTicket: {
          ...sampleTicket,
          ticketId: 'ticket-new',
          displayId: 'T-NEW',
          subject: input.subject,
          customFields: input.customFields ?? {},
        },
      },
    });
  }),

  // Tickets - Update
  superopsApi.mutation('UpdateTicket', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { ticketId: string; [key: string]: unknown };
    };
    if (input.ticketId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        updateTicket: {
          ...sampleTicket,
          ticketId: input.ticketId,
          subject: input.subject ?? sampleTicket.subject,
          customFields: input.customFields ?? sampleTicket.customFields,
        },
      },
    });
  }),
];