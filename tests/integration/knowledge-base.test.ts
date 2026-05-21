/**
 * Knowledge Base integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';
import { SuperOpsNotFoundError } from '../../src/errors.js';

describe('Knowledge Base Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('get', () => {
    it('should get a single KB collection by ID', async () => {
      const kbItem = await client.knowledgeBase.get('kb-collection-123');

      expect(kbItem.itemId).toBe('kb-collection-123');
      expect(kbItem.name).toBe('General IT Support');
      expect(kbItem.itemType).toBe('KB_COLLECTION');
      expect(kbItem.description).toBe('General IT support documentation and procedures');
      expect(kbItem.status).toBe('PUBLISHED');
      expect(kbItem.createdBy?.name).toBe('Admin User');
    });

    it('should get a single KB article by ID', async () => {
      const kbItem = await client.knowledgeBase.get('kb-article-456');

      expect(kbItem.itemId).toBe('kb-article-456');
      expect(kbItem.name).toBe('How to Reset Password');
      expect(kbItem.itemType).toBe('KB_ARTICLE');
      expect(kbItem.articleType).toBe('INSTRUCTION');
      expect(kbItem.parent?.itemId).toBe('kb-collection-123');
      expect(kbItem.parent?.name).toBe('General IT Support');
    });

    it('should throw NotFoundError for non-existent KB item', async () => {
      await expect(client.knowledgeBase.get('not-found')).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('list', () => {
    it('should list KB items with pagination metadata', async () => {
      const result = await client.knowledgeBase.list();

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalCount).toBe(3);

      // Should include both collections and articles
      const collections = result.items.filter(item => item.itemType === 'KB_COLLECTION');
      const articles = result.items.filter(item => item.itemType === 'KB_ARTICLE');
      expect(collections.length).toBe(1);
      expect(articles.length).toBe(2);
    });

    it('should accept page parameters', async () => {
      const result = await client.knowledgeBase.list({ page: 1, pageSize: 10 });

      expect(result.meta.pageSize).toBe(10);
    });
  });

  describe('listAll', () => {
    it('should iterate through all KB items', async () => {
      const kbItems = [];

      for await (const item of client.knowledgeBase.listAll()) {
        kbItems.push(item);
      }

      expect(kbItems.length).toBe(3);
      expect(kbItems[0].name).toBe('General IT Support');
      expect(kbItems[1].name).toBe('How to Reset Password');
      expect(kbItems[2].name).toBe('Troubleshooting Network Connectivity');
    });

    it('should support toArray()', async () => {
      const kbItems = await client.knowledgeBase.listAll().toArray();

      expect(kbItems.length).toBe(3);
    });
  });

  describe('createArticle', () => {
    it('should create a new KB article', async () => {
      const article = await client.knowledgeBase.createArticle({
        name: 'New Article',
        description: 'A new knowledge base article',
        parentId: 'kb-collection-123',
      });

      expect(article.itemId).toBe('kb-article-new');
      expect(article.name).toBe('New Article');
      expect(article.description).toBe('A new knowledge base article');
      expect(article.itemType).toBe('KB_ARTICLE');
    });
  });

  describe('updateArticle', () => {
    it('should update an existing KB article', async () => {
      const article = await client.knowledgeBase.updateArticle({
        itemId: 'kb-article-456',
        name: 'Updated Article Name',
        description: 'Updated description',
      });

      expect(article.itemId).toBe('kb-article-456');
      expect(article.name).toBe('Updated Article Name');
      expect(article.description).toBe('Updated description');
    });

    it('should throw NotFoundError for non-existent article', async () => {
      await expect(
        client.knowledgeBase.updateArticle({
          itemId: 'not-found',
          name: 'Updated Name',
        })
      ).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('deleteArticle', () => {
    it('should delete a KB article', async () => {
      const result = await client.knowledgeBase.deleteArticle({
        itemId: 'kb-article-456',
      });

      expect(result).toBe(true);
    });

    it('should throw NotFoundError for non-existent article', async () => {
      await expect(
        client.knowledgeBase.deleteArticle({
          itemId: 'not-found',
        })
      ).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('createCollection', () => {
    it('should create a new KB collection', async () => {
      const collection = await client.knowledgeBase.createCollection({
        name: 'New Collection',
        description: 'A new knowledge base collection',
      });

      expect(collection.itemId).toBe('kb-collection-new');
      expect(collection.name).toBe('New Collection');
      expect(collection.description).toBe('A new knowledge base collection');
      expect(collection.itemType).toBe('KB_COLLECTION');
    });
  });

  describe('updateCollection', () => {
    it('should update an existing KB collection', async () => {
      const collection = await client.knowledgeBase.updateCollection({
        itemId: 'kb-collection-123',
        name: 'Updated Collection Name',
        description: 'Updated description',
      });

      expect(collection.itemId).toBe('kb-collection-123');
      expect(collection.name).toBe('Updated Collection Name');
      expect(collection.description).toBe('Updated description');
    });

    it('should throw NotFoundError for non-existent collection', async () => {
      await expect(
        client.knowledgeBase.updateCollection({
          itemId: 'not-found',
          name: 'Updated Name',
        })
      ).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('deleteCollection', () => {
    it('should delete a KB collection', async () => {
      const result = await client.knowledgeBase.deleteCollection({
        itemId: 'kb-collection-123',
      });

      expect(result).toBe(true);
    });

    it('should throw NotFoundError for non-existent collection', async () => {
      await expect(
        client.knowledgeBase.deleteCollection({
          itemId: 'not-found',
        })
      ).rejects.toThrow(SuperOpsNotFoundError);
    });
  });
});