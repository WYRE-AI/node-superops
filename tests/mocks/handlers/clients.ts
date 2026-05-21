/**
 * MSW handlers for the SuperOps Clients API.
 */

import { HttpResponse } from 'msw';
import { superopsApi, checkAuth, authenticationError, notFoundError } from '../shared.js';

/** Sample client data. Shape matches the SuperOps `Client` GraphQL type. */
const sampleClient = {
  accountId: 'client-456',
  name: 'Acme Corp',
  stage: 'Active',
  status: 'Paid',
  emailDomains: ['acme.com', 'acmetech.com'],
  accountManager: { userId: 'user-1', name: 'John Manager' },
  primaryContact: { userId: 'user-2', name: 'Jane Contact' },
  secondaryContact: { userId: 'user-3', name: 'Bob Secondary' },
  hqSite: { id: 'site-789', name: 'Acme HQ' },
  technicianGroups: [
    { id: 'group-1', name: 'Level 1 Support' },
    { id: 'group-2', name: 'Level 2 Support' },
  ],
  customFields: {},
};

const sampleClient2 = {
  accountId: 'client-789',
  name: 'Beta Industries',
  stage: 'Active',
  status: 'Paid',
  emailDomains: ['beta-industries.com'],
  accountManager: { userId: 'user-1', name: 'John Manager' },
  primaryContact: { userId: 'user-4', name: 'Alice Beta' },
  secondaryContact: null,
  hqSite: { id: 'site-456', name: 'Beta Main Office' },
  technicianGroups: [
    { id: 'group-1', name: 'Level 1 Support' },
  ],
  customFields: {},
};

export const clientHandlers = [
  // Clients - Get single
  superopsApi.query('GetClient', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { accountId: string } };
    if (input.accountId === 'client-456') {
      return HttpResponse.json({ data: { getClient: sampleClient } });
    }
    return HttpResponse.json(notFoundError);
  }),

  // Clients - List (page-based)
  superopsApi.query('GetClientList', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { page?: number; pageSize?: number } };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 50;
    const clients = page === 1 ? [sampleClient, sampleClient2] : [];

    return HttpResponse.json({
      data: {
        getClientList: {
          clients,
          listInfo: { page, pageSize, totalCount: 2 },
        },
      },
    });
  }),

  // Clients - Create
  superopsApi.mutation('CreateClientV2', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { name: string; stage?: string; customFields?: Record<string, unknown> };
    };

    return HttpResponse.json({
      data: {
        createClientV2: {
          ...sampleClient,
          accountId: 'client-new',
          name: input.name,
          stage: input.stage ?? 'Active',
          customFields: input.customFields ?? {},
        },
      },
    });
  }),

  // Clients - Update
  superopsApi.mutation('UpdateClient', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { accountId: string; name?: string; customFields?: Record<string, unknown> };
    };
    if (input.accountId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        updateClient: {
          ...sampleClient,
          accountId: input.accountId,
          name: input.name ?? sampleClient.name,
          customFields: input.customFields ?? sampleClient.customFields,
        },
      },
    });
  }),
];
