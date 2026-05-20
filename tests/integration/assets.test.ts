/**
 * Assets integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';
import { SuperOpsNotFoundError } from '../../src/errors.js';

describe('Assets Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('get', () => {
    it('should get a single asset by ID', async () => {
      const asset = await client.assets.get('asset-123');

      expect(asset.assetId).toBe('asset-123');
      expect(asset.name).toBe('Test Workstation');
      expect(asset.status).toBe('ACTIVE');
      expect(asset.hostName).toBe('WS-001');
      expect(asset.client?.accountId).toBe('client-456');
      expect(asset.client?.name).toBe('Acme Corp');
    });

    it('should throw NotFoundError for non-existent asset', async () => {
      await expect(client.assets.get('not-found')).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('list', () => {
    it('should list assets with pagination metadata', async () => {
      const result = await client.assets.list();

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalCount).toBe(2);
    });

    it('should accept page parameters', async () => {
      const result = await client.assets.list({ page: 1, pageSize: 10 });

      expect(result.meta.pageSize).toBe(10);
    });
  });

  describe('listAll', () => {
    it('should iterate through all assets', async () => {
      const assets = [];

      for await (const asset of client.assets.listAll()) {
        assets.push(asset);
      }

      expect(assets.length).toBe(2);
      expect(assets[0].name).toBe('Test Workstation');
      expect(assets[1].name).toBe('Test Server');
    });

    it('should support toArray()', async () => {
      const assets = await client.assets.listAll().toArray();

      expect(assets.length).toBe(2);
    });
  });

  describe('update', () => {
    it("should update an asset's custom fields", async () => {
      const asset = await client.assets.update('asset-123', {
        customFields: { location: 'HQ' },
      });

      expect(asset.assetId).toBe('asset-123');
      expect(asset.customFields).toEqual({ location: 'HQ' });
    });
  });
});
