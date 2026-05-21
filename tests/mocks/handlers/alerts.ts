/**
 * MSW handlers for the SuperOps Alerts API.
 */

import { HttpResponse } from 'msw';
import { superopsApi, checkAuth, authenticationError, notFoundError } from '../shared.js';

/** Sample alert data. Shape matches the SuperOps `Alert` GraphQL type. */
const sampleAlert = {
  id: 'alert-123',
  message: 'High CPU Usage Detected',
  description: 'CPU usage has been above 90% for the last 5 minutes',
  severity: 'Critical',
  status: 'Active',
  createdTime: '2026-05-20T10:00:00.000Z',
  resolvedTime: null,
  asset: {
    assetId: 'asset-123',
    name: 'Test Workstation',
  },
  policy: {
    id: 'policy-456',
    name: 'CPU Monitoring Policy',
  },
};

const sampleAlert2 = {
  id: 'alert-456',
  message: 'Disk Space Low',
  description: 'Available disk space is below 10%',
  severity: 'Warning',
  status: 'Resolved',
  createdTime: '2026-05-20T09:00:00.000Z',
  resolvedTime: '2026-05-20T09:30:00.000Z',
  asset: {
    assetId: 'asset-456',
    name: 'Test Server',
  },
  policy: {
    id: 'policy-789',
    name: 'Disk Space Monitoring',
  },
};

export const alertHandlers = [
  // Alerts - List (page-based)
  superopsApi.query('GetAlertList', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { page?: number; pageSize?: number } };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 50;
    const alerts = page === 1 ? [sampleAlert, sampleAlert2] : [];

    return HttpResponse.json({
      data: {
        getAlertList: {
          alerts,
          listInfo: { page, pageSize, totalCount: 2 },
        },
      },
    });
  }),

  // Alerts - List by asset
  superopsApi.query('GetAlertsForAsset', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { assetId: string; page?: number; pageSize?: number }
    };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 50;

    // Return alerts for specific asset
    const alerts = input.assetId === 'asset-123' && page === 1 ? [sampleAlert] : [];

    return HttpResponse.json({
      data: {
        getAlertsForAsset: {
          alerts,
          listInfo: { page, pageSize, totalCount: alerts.length },
        },
      },
    });
  }),

  // Alerts - Create
  superopsApi.mutation('CreateAlert', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { message: string; description?: string; severity: string; assetId?: string };
    };

    return HttpResponse.json({
      data: {
        createAlert: {
          ...sampleAlert,
          id: 'alert-new',
          message: input.message,
          description: input.description,
          severity: input.severity,
          asset: input.assetId ? { assetId: input.assetId, name: 'Test Asset' } : null,
        },
      },
    });
  }),

  // Alerts - Resolve
  superopsApi.mutation('ResolveAlerts', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { alertIds: string[] } };

    if (input.alertIds.includes('not-found')) {
      return HttpResponse.json(notFoundError);
    }

    // Return resolved alerts
    const resolvedAlerts = input.alertIds.map(id => ({
      ...sampleAlert,
      id,
      status: 'Resolved',
      resolvedTime: '2026-05-20T12:00:00.000Z',
    }));

    return HttpResponse.json({
      data: {
        resolveAlerts: resolvedAlerts,
      },
    });
  }),
];
