/**
 * MSW handlers for the SuperOps Technicians API.
 */

import { HttpResponse } from 'msw';
import { superopsApi, checkAuth, authenticationError, notFoundError, validationError } from '../shared.js';

/** Sample technician data. Shape matches the SuperOps `Technician` GraphQL type. */
const sampleTechnician1 = {
  userId: 'tech-123',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@acme.com',
  phoneNumber: '+1-555-0123',
  role: { roleId: 'role-1', name: 'Senior Technician' },
  status: 'ACTIVE',
  isActive: true,
  department: 'IT Support',
  jobTitle: 'Senior IT Technician',
  timeZone: 'America/New_York',
  groups: [
    { groupId: 'group-1', name: 'Field Technicians' }
  ],
  createdDate: '2025-01-15T09:00:00.000Z',
  modifiedDate: '2026-02-04T10:00:00.000Z',
};

const sampleTechnician2 = {
  userId: 'tech-456',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@acme.com',
  phoneNumber: '+1-555-0456',
  role: { roleId: 'role-2', name: 'Technician' },
  status: 'ACTIVE',
  isActive: true,
  department: 'IT Support',
  jobTitle: 'IT Technician',
  timeZone: 'America/Los_Angeles',
  groups: [
    { groupId: 'group-2', name: 'Remote Support' }
  ],
  createdDate: '2025-03-20T14:30:00.000Z',
  modifiedDate: '2026-01-10T08:15:00.000Z',
};

export const technicianHandlers = [
  // Technicians - List (page-based)
  superopsApi.query('GetTechnicianList', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { page?: number; pageSize?: number } };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 50;
    const technicians = page === 1 ? [sampleTechnician1, sampleTechnician2] : [];

    return HttpResponse.json({
      data: {
        getTechnicianList: {
          technicians,
          listInfo: { page, pageSize, totalCount: 2 },
        },
      },
    });
  }),

  // Technicians - Create
  superopsApi.mutation('CreateTechnician', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        roleId?: string;
        department?: string;
        jobTitle?: string;
        timeZone?: string;
        groupIds?: string[];
      };
    };

    if (!input.firstName || !input.lastName || !input.email) {
      return HttpResponse.json(validationError);
    }

    return HttpResponse.json({
      data: {
        createTechnician: {
          userId: 'tech-new',
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber || null,
          role: input.roleId ? { roleId: input.roleId, name: 'Assigned Role' } : null,
          status: 'ACTIVE',
          isActive: true,
          department: input.department || null,
          jobTitle: input.jobTitle || null,
          timeZone: input.timeZone || 'UTC',
          groups: input.groupIds ? input.groupIds.map(id => ({ groupId: id, name: 'Group' })) : [],
          createdDate: '2026-05-20T12:00:00.000Z',
          modifiedDate: '2026-05-20T12:00:00.000Z',
        },
      },
    });
  }),

  // Technicians - Update
  superopsApi.mutation('UpdateTechnician', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: {
        userId: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        roleId?: string;
        department?: string;
        jobTitle?: string;
        timeZone?: string;
        groupIds?: string[];
        isActive?: boolean;
      };
    };

    if (input.userId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        updateTechnician: {
          ...sampleTechnician1,
          userId: input.userId,
          firstName: input.firstName ?? sampleTechnician1.firstName,
          lastName: input.lastName ?? sampleTechnician1.lastName,
          email: input.email ?? sampleTechnician1.email,
          phoneNumber: input.phoneNumber ?? sampleTechnician1.phoneNumber,
          role: input.roleId ? { roleId: input.roleId, name: 'Updated Role' } : sampleTechnician1.role,
          department: input.department ?? sampleTechnician1.department,
          jobTitle: input.jobTitle ?? sampleTechnician1.jobTitle,
          timeZone: input.timeZone ?? sampleTechnician1.timeZone,
          groups: input.groupIds ? input.groupIds.map(id => ({ groupId: id, name: 'Updated Group' })) : sampleTechnician1.groups,
          isActive: input.isActive ?? sampleTechnician1.isActive,
          modifiedDate: '2026-05-20T12:00:00.000Z',
        },
      },
    });
  }),

  // Technicians - Delete
  superopsApi.mutation('DeleteTechnician', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { userId: string } };
    if (input.userId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        deleteTechnician: true,
      },
    });
  }),
];
