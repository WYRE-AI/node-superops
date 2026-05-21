/**
 * MSW handlers for the SuperOps Assets API.
 */

import { HttpResponse } from 'msw';
import { superopsApi, checkAuth, authenticationError, notFoundError } from '../shared.js';

/** Sample asset data. Shape matches the SuperOps `Asset` GraphQL type. */
const sampleAsset = {
  assetId: 'asset-123',
  name: 'Test Workstation',
  assetClass: { classId: 'class-1', name: 'Workstation' },
  client: { accountId: 'client-456', name: 'Acme Corp' },
  site: { id: 'site-789', name: 'Main Office' },
  requester: { userId: 'user-1', name: 'Jane Doe' },
  primaryMac: '00:11:22:33:44:55',
  loggedInUser: 'jdoe',
  serialNumber: 'SN123456',
  manufacturer: 'Dell',
  model: 'OptiPlex 7080',
  hostName: 'WS-001',
  publicIp: '203.0.113.10',
  gateway: '192.168.1.1',
  platform: 'Windows 11 Pro',
  domain: 'acme.local',
  status: 'ACTIVE',
  sysUptime: '5 days',
  lastCommunicatedTime: '2026-02-04T10:00:00.000Z',
  agentVersion: '1.2.3',
  platformFamily: 'Windows',
  platformCategory: 'Desktop',
  platformVersion: '11',
  patchStatus: 'UP_TO_DATE',
  warrantyExpiryDate: '2028-06-15',
  purchasedDate: '2025-06-15',
  lastReportedTime: '2026-02-04T10:00:00.000Z',
  customFields: {},
};

const sampleAsset2 = {
  assetId: 'asset-456',
  name: 'Test Server',
  assetClass: { classId: 'class-2', name: 'Server' },
  client: { accountId: 'client-456', name: 'Acme Corp' },
  site: { id: 'site-789', name: 'Main Office' },
  requester: null,
  primaryMac: 'AA:BB:CC:DD:EE:FF',
  loggedInUser: null,
  serialNumber: 'SN789012',
  manufacturer: 'HP',
  model: 'ProLiant DL380',
  hostName: 'SRV-001',
  publicIp: '203.0.113.11',
  gateway: '192.168.1.1',
  platform: 'Windows Server 2022',
  domain: 'acme.local',
  status: 'ACTIVE',
  sysUptime: '120 days',
  lastCommunicatedTime: '2026-02-04T10:00:00.000Z',
  agentVersion: '1.2.3',
  platformFamily: 'Windows',
  platformCategory: 'Server',
  platformVersion: '2022',
  patchStatus: 'PENDING',
  warrantyExpiryDate: null,
  purchasedDate: '2025-01-10',
  lastReportedTime: '2026-02-04T10:00:00.000Z',
  customFields: {},
};

export const assetHandlers = [
  // Assets - Get single
  superopsApi.query('GetAsset', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { assetId: string } };
    if (input.assetId === 'asset-123') {
      return HttpResponse.json({ data: { getAsset: sampleAsset } });
    }
    return HttpResponse.json(notFoundError);
  }),

  // Assets - List (page-based)
  superopsApi.query('GetAssetList', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { page?: number; pageSize?: number } };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 50;
    const assets = page === 1 ? [sampleAsset, sampleAsset2] : [];

    return HttpResponse.json({
      data: {
        getAssetList: {
          assets,
          listInfo: { page, pageSize, totalCount: 2 },
        },
      },
    });
  }),

  // Assets - Update
  superopsApi.mutation('UpdateAsset', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { assetId: string; customFields?: Record<string, unknown> };
    };
    if (input.assetId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        updateAsset: {
          ...sampleAsset,
          assetId: input.assetId,
          customFields: input.customFields ?? sampleAsset.customFields,
        },
      },
    });
  }),
];
