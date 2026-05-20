/**
 * Clients integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';
import { SuperOpsNotFoundError } from '../../src/errors.js';

describe('Clients Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('get', () => {
    it('should get a single client by account ID', async () => {
      const clientRecord = await client.clients.get('client-456');

      expect(clientRecord.accountId).toBe('client-456');
      expect(clientRecord.name).toBe('Acme Corp');
      expect(clientRecord.stage).toBe('Active');
      expect(clientRecord.status).toBe('Paid');
      expect(clientRecord.emailDomains).toEqual(['acme.com', 'acmetech.com']);
      expect(clientRecord.accountManager?.userId).toBe('user-1');
      expect(clientRecord.accountManager?.name).toBe('John Manager');
    });

    it('should throw NotFoundError for non-existent client', async () => {
      await expect(client.clients.get('not-found')).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('list', () => {
    it('should list clients with pagination metadata', async () => {
      const result = await client.clients.list();

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalCount).toBe(2);
    });

    it('should accept page parameters', async () => {
      const result = await client.clients.list({ page: 1, pageSize: 10 });

      expect(result.meta.pageSize).toBe(10);
    });
  });

  describe('listAll', () => {
    it('should iterate through all clients', async () => {
      const clients = [];

      for await (const clientRecord of client.clients.listAll()) {
        clients.push(clientRecord);
      }

      expect(clients.length).toBe(2);
      expect(clients[0].name).toBe('Acme Corp');
      expect(clients[1].name).toBe('Beta Industries');
    });

    it('should support toArray()', async () => {
      const clients = await client.clients.listAll().toArray();

      expect(clients.length).toBe(2);
    });
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const clientRecord = await client.clients.create({
        name: 'New Client Corp',
        stage: 'Prospect',
        customFields: { department: 'Engineering' },
      });

      expect(clientRecord.accountId).toBe('client-new');
      expect(clientRecord.name).toBe('New Client Corp');
      expect(clientRecord.stage).toBe('Prospect');
      expect(clientRecord.customFields).toEqual({ department: 'Engineering' });
    });
  });

  describe('update', () => {
    it("should update a client's fields", async () => {
      const clientRecord = await client.clients.update('client-456', {
        name: 'Updated Acme Corp',
        customFields: { location: 'HQ' },
      });

      expect(clientRecord.accountId).toBe('client-456');
      expect(clientRecord.name).toBe('Updated Acme Corp');
      expect(clientRecord.customFields).toEqual({ location: 'HQ' });
    });
  });
});
