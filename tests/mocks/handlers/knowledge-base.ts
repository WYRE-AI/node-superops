/**
 * MSW handlers for the SuperOps Knowledge Base API.
 */

import { HttpResponse } from 'msw';
import { superopsApi, checkAuth, authenticationError, notFoundError, validationError } from '../shared.js';

/** Sample KB collection data. Shape matches the SuperOps `KbItem` GraphQL type. */
const sampleCollection = {
  itemId: 'kb-collection-123',
  name: 'General IT Support',
  parent: null,
  itemType: 'KB_COLLECTION',
  description: 'General IT support documentation and procedures',
  status: 'PUBLISHED',
  createdBy: { userId: 'user-1', name: 'Admin User' },
  createdOn: '2026-01-15T10:00:00.000Z',
  lastModifiedBy: { userId: 'user-1', name: 'Admin User' },
  lastModifiedOn: '2026-01-15T10:00:00.000Z',
  viewCount: 42,
  articleType: null,
  visibility: { shared: true, sharedWith: ['all'] },
  loginRequired: false,
};

/** Sample KB article data. Shape matches the SuperOps `KbItem` GraphQL type. */
const sampleArticle = {
  itemId: 'kb-article-456',
  name: 'How to Reset Password',
  parent: { itemId: 'kb-collection-123', name: 'General IT Support' },
  itemType: 'KB_ARTICLE',
  description: 'Step-by-step guide for resetting user passwords in Active Directory',
  status: 'PUBLISHED',
  createdBy: { userId: 'user-2', name: 'Tech Writer' },
  createdOn: '2026-01-20T14:30:00.000Z',
  lastModifiedBy: { userId: 'user-2', name: 'Tech Writer' },
  lastModifiedOn: '2026-02-01T09:15:00.000Z',
  viewCount: 128,
  articleType: 'INSTRUCTION',
  visibility: { shared: true, sharedWith: ['technicians'] },
  loginRequired: true,
};

const sampleArticle2 = {
  itemId: 'kb-article-789',
  name: 'Troubleshooting Network Connectivity',
  parent: { itemId: 'kb-collection-123', name: 'General IT Support' },
  itemType: 'KB_ARTICLE',
  description: 'Common network connectivity issues and their solutions',
  status: 'DRAFT',
  createdBy: { userId: 'user-3', name: 'Network Admin' },
  createdOn: '2026-02-03T11:00:00.000Z',
  lastModifiedBy: { userId: 'user-3', name: 'Network Admin' },
  lastModifiedOn: '2026-02-03T16:45:00.000Z',
  viewCount: 5,
  articleType: 'TROUBLESHOOTING',
  visibility: { shared: false, sharedWith: [] },
  loginRequired: false,
};

export const knowledgeBaseHandlers = [
  // KB Items - Get single
  superopsApi.query('GetKbItem', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { itemId: string } };
    if (input.itemId === 'kb-collection-123') {
      return HttpResponse.json({ data: { getKbItem: sampleCollection } });
    }
    if (input.itemId === 'kb-article-456') {
      return HttpResponse.json({ data: { getKbItem: sampleArticle } });
    }
    if (input.itemId === 'kb-article-789') {
      return HttpResponse.json({ data: { getKbItem: sampleArticle2 } });
    }
    return HttpResponse.json(notFoundError);
  }),

  // KB Items - List (page-based)
  superopsApi.query('GetKbItems', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { listInfo } = variables as { listInfo: { page?: number; pageSize?: number } };
    const page = listInfo.page ?? 1;
    const pageSize = listInfo.pageSize ?? 50;
    const kbItems = page === 1 ? [sampleCollection, sampleArticle, sampleArticle2] : [];

    return HttpResponse.json({
      data: {
        getKbItems: {
          kbItems,
          listInfo: { page, pageSize, totalCount: 3 },
        },
      },
    });
  }),

  // KB Article - Create
  superopsApi.mutation('CreateKbArticle', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { name: string; description?: string; parentId?: string };
    };

    if (!input.name) {
      return HttpResponse.json(validationError);
    }

    return HttpResponse.json({
      data: {
        createKbArticle: {
          ...sampleArticle,
          itemId: 'kb-article-new',
          name: input.name,
          description: input.description,
          parent: input.parentId ? { itemId: input.parentId, name: 'Parent Collection' } : null,
        },
      },
    });
  }),

  // KB Article - Update
  superopsApi.mutation('UpdateKbArticle', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { itemId: string; name?: string; description?: string };
    };

    if (input.itemId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        updateKbArticle: {
          ...sampleArticle,
          itemId: input.itemId,
          name: input.name ?? sampleArticle.name,
          description: input.description ?? sampleArticle.description,
          lastModifiedOn: new Date().toISOString(),
        },
      },
    });
  }),

  // KB Article - Delete
  superopsApi.mutation('DeleteKbArticle', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { itemId: string } };

    if (input.itemId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: { deleteKbArticle: true },
    });
  }),

  // KB Collection - Create
  superopsApi.mutation('CreateKbCollection', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { name: string; description?: string; parentId?: string };
    };

    if (!input.name) {
      return HttpResponse.json(validationError);
    }

    return HttpResponse.json({
      data: {
        createKbCollection: {
          ...sampleCollection,
          itemId: 'kb-collection-new',
          name: input.name,
          description: input.description,
          parent: input.parentId ? { itemId: input.parentId, name: 'Parent Collection' } : null,
        },
      },
    });
  }),

  // KB Collection - Update
  superopsApi.mutation('UpdateKbCollection', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as {
      input: { itemId: string; name?: string; description?: string };
    };

    if (input.itemId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        updateKbCollection: {
          ...sampleCollection,
          itemId: input.itemId,
          name: input.name ?? sampleCollection.name,
          description: input.description ?? sampleCollection.description,
          lastModifiedOn: new Date().toISOString(),
        },
      },
    });
  }),

  // KB Collection - Delete
  superopsApi.mutation('DeleteKbCollection', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { itemId: string } };

    if (input.itemId === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: { deleteKbCollection: true },
    });
  }),
];
