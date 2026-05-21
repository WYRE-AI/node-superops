/**
 * MSW handlers for the SuperOps Client Contracts API.
 */

import { HttpResponse } from 'msw';
import { superopsApi, checkAuth, authenticationError, notFoundError, validationError } from '../shared.js';

/** Sample contract data. Shape matches the SuperOps `ClientContract` GraphQL type. */
const sampleContract = {
  contractId: 12345,
  client: { accountId: 'client-456', name: 'Acme Corp' },
  contract: {
    name: 'IT Support Contract',
    description: 'Comprehensive IT support for Acme Corp',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    contractStatus: 'ACTIVE',
    contractValue: 120000,
    currency: 'USD',
    billingCycle: 'MONTHLY',
    autoRenew: true,
    customFields: {},
  },
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  contractStatus: 'ACTIVE',
};

const sampleContract2 = {
  contractId: 12346,
  client: { accountId: 'client-789', name: 'TechStart Inc' },
  contract: {
    name: 'Security Services Contract',
    description: 'Cybersecurity monitoring and response',
    startDate: '2026-02-01',
    endDate: '2027-01-31',
    contractStatus: 'DRAFT',
    contractValue: 84000,
    currency: 'USD',
    billingCycle: 'ANNUALLY',
    autoRenew: false,
    customFields: { priority: 'high' },
  },
  startDate: '2026-02-01',
  endDate: '2027-01-31',
  contractStatus: 'DRAFT',
};

export const contractHandlers = [
  // Contracts - Get single
  superopsApi.query('GetClientContract', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { contractId: number } };
    if (input.contractId === 12345) {
      return HttpResponse.json({ data: { getClientContract: sampleContract } });
    }
    return HttpResponse.json(notFoundError);
  }),

  // Contracts - List (page-based)
  superopsApi.query('GetClientContractList', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input?: { page?: number; pageSize?: number } } | undefined;
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 50;
    const clientContracts = page === 1 ? [sampleContract, sampleContract2] : [];

    return HttpResponse.json({
      data: {
        getClientContractList: {
          clientContracts,
          listInfo: { page, pageSize, totalCount: 2 },
        },
      },
    });
  }),

  // Contracts - Create
  superopsApi.mutation('CreateClientContract', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: {
        clientId: string;
        name: string;
        description?: string;
        startDate: string;
        endDate?: string;
        contractValue?: number;
        currency?: string;
        billingCycle?: string;
        autoRenew?: boolean;
        customFields?: Record<string, unknown>;
      };
    };

    if (!input.name || !input.clientId || !input.startDate) {
      return HttpResponse.json(validationError);
    }

    // Return new contract ID
    return HttpResponse.json({
      data: {
        createClientContract: '12347',
      },
    });
  }),

  // Contracts - Update
  superopsApi.mutation('UpdateClientContract', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: {
        contractId: number;
        name?: string;
        description?: string;
        startDate?: string;
        endDate?: string;
        contractValue?: number;
        currency?: string;
        billingCycle?: string;
        autoRenew?: boolean;
        contractStatus?: string;
        customFields?: Record<string, unknown>;
      };
    };

    if (input.contractId === 999) {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        updateClientContract: {
          ...sampleContract,
          contractId: input.contractId,
          contract: {
            ...sampleContract.contract,
            name: input.name ?? sampleContract.contract.name,
            description: input.description ?? sampleContract.contract.description,
            contractValue: input.contractValue ?? sampleContract.contract.contractValue,
            contractStatus: input.contractStatus ?? sampleContract.contract.contractStatus,
            customFields: input.customFields ?? sampleContract.contract.customFields,
          },
          contractStatus: input.contractStatus ?? sampleContract.contractStatus,
        },
      },
    });
  }),
];