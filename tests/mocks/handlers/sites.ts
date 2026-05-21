/**
 * MSW handlers for the SuperOps Client Sites API.
 */

import { HttpResponse } from 'msw';
import { superopsApi, checkAuth, authenticationError, notFoundError } from '../shared.js';

/** Sample client site data. Shape matches the SuperOps `ClientSite` GraphQL type. */
const sampleSite = {
  id: 'site-123',
  name: 'Main Office',
  timezoneCode: 'America/New_York',
  working24x7: false,
  businessHour: [
    {
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '17:00',
      isWorkingDay: true,
    },
    {
      dayOfWeek: 'TUESDAY',
      startTime: '09:00',
      endTime: '17:00',
      isWorkingDay: true,
    },
  ],
  holidayList: {
    id: 'holidays-1',
    name: 'US Federal Holidays',
  },
  line1: '123 Main Street',
  line2: 'Suite 100',
  line3: null,
  city: 'New York',
  postalCode: '10001',
  countryCode: 'US',
  stateCode: 'NY',
  contactNumber: '+1-555-123-4567',
  client: {
    id: 'client-456',
    name: 'Acme Corp',
  },
  hq: true,
  installerInfo: [
    {
      id: 'installer-1',
      name: 'Tech Install Co',
      contactNumber: '+1-555-987-6543',
    },
  ],
};

const sampleSite2 = {
  id: 'site-456',
  name: 'Branch Office',
  timezoneCode: 'America/Los_Angeles',
  working24x7: true,
  businessHour: [],
  holidayList: null,
  line1: '456 Oak Avenue',
  line2: null,
  line3: null,
  city: 'Los Angeles',
  postalCode: '90210',
  countryCode: 'US',
  stateCode: 'CA',
  contactNumber: '+1-555-246-8135',
  client: {
    id: 'client-456',
    name: 'Acme Corp',
  },
  hq: false,
  installerInfo: [],
};

export const siteHandlers = [
  // Client Sites - Get single
  superopsApi.query('GetClientSite', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { siteId: string } };
    if (input.siteId === 'site-123') {
      return HttpResponse.json({ data: { getClientSite: sampleSite } });
    }
    return HttpResponse.json(notFoundError);
  }),

  // Client Sites - List (page-based)
  superopsApi.query('GetClientSiteList', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { page?: number; pageSize?: number } };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 50;
    const clientSites = page === 1 ? [sampleSite, sampleSite2] : [];

    return HttpResponse.json({
      data: {
        getClientSiteList: {
          clientSites,
          listInfo: { page, pageSize, totalCount: 2 },
        },
      },
    });
  }),

  // Client Sites - Create
  superopsApi.mutation('CreateClientSite', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: {
        name: string;
        timezoneCode?: string;
        working24x7?: boolean;
        line1?: string;
        city?: string;
        countryCode?: string;
        contactNumber?: string;
        hq?: boolean;
      };
    };

    return HttpResponse.json({
      data: {
        createClientSite: {
          ...sampleSite,
          id: 'site-new',
          name: input.name,
          timezoneCode: input.timezoneCode ?? sampleSite.timezoneCode,
          working24x7: input.working24x7 ?? sampleSite.working24x7,
          line1: input.line1 ?? sampleSite.line1,
          city: input.city ?? sampleSite.city,
          countryCode: input.countryCode ?? sampleSite.countryCode,
          contactNumber: input.contactNumber ?? sampleSite.contactNumber,
          hq: input.hq ?? sampleSite.hq,
        },
      },
    });
  }),

  // Client Sites - Update
  superopsApi.mutation('UpdateClientSite', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: {
        siteId: string;
        name?: string;
        timezoneCode?: string;
        working24x7?: boolean;
        line1?: string;
        city?: string;
        countryCode?: string;
        contactNumber?: string;
        hq?: boolean;
      };
    };

    if (input.siteId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        updateClientSite: {
          ...sampleSite,
          id: input.siteId,
          name: input.name ?? sampleSite.name,
          timezoneCode: input.timezoneCode ?? sampleSite.timezoneCode,
          working24x7: input.working24x7 ?? sampleSite.working24x7,
          line1: input.line1 ?? sampleSite.line1,
          city: input.city ?? sampleSite.city,
          countryCode: input.countryCode ?? sampleSite.countryCode,
          contactNumber: input.contactNumber ?? sampleSite.contactNumber,
          hq: input.hq ?? sampleSite.hq,
        },
      },
    });
  }),
];
