/**
 * Contracts integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';
import { SuperOpsNotFoundError } from '../../src/errors.js';

describe('Contracts Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('get', () => {
    it('should get a single contract by ID', async () => {
      const contract = await client.contracts.get(12345);

      expect(contract.contractId).toBe(12345);
      expect(contract.client?.accountId).toBe('client-456');
      expect(contract.client?.name).toBe('Acme Corp');
      expect(contract.contract?.name).toBe('IT Support Contract');
      expect(contract.contractStatus).toBe('ACTIVE');
      expect(contract.startDate).toBe('2026-01-01');
      expect(contract.endDate).toBe('2026-12-31');
    });

    it('should throw NotFoundError for non-existent contract', async () => {
      await expect(client.contracts.get(999)).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('list', () => {
    it('should list contracts with pagination metadata', async () => {
      const result = await client.contracts.list();

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalCount).toBe(2);
    });

    it('should accept page parameters', async () => {
      const result = await client.contracts.list({ page: 1, pageSize: 10 });

      expect(result.meta.pageSize).toBe(10);
    });
  });

  describe('listAll', () => {
    it('should iterate through all contracts', async () => {
      const contracts = [];

      for await (const contract of client.contracts.listAll()) {
        contracts.push(contract);
      }

      expect(contracts.length).toBe(2);
      expect(contracts[0].contract?.name).toBe('IT Support Contract');
      expect(contracts[1].contract?.name).toBe('Security Services Contract');
    });

    it('should support toArray()', async () => {
      const contracts = await client.contracts.listAll().toArray();

      expect(contracts.length).toBe(2);
    });
  });

  describe('create', () => {
    it('should create a new contract', async () => {
      const contractId = await client.contracts.create({
        clientId: 'client-123',
        name: 'New Support Contract',
        description: 'A new IT support contract',
        startDate: '2026-03-01',
        endDate: '2027-02-28',
        contractValue: 100000,
        currency: 'USD',
        billingCycle: 'ANNUALLY',
        autoRenew: true,
      });

      expect(contractId).toBe('12347');
    });
  });

  describe('update', () => {
    it('should update an existing contract', async () => {
      const contract = await client.contracts.update(12345, {
        name: 'Updated IT Support Contract',
        contractValue: 150000,
        contractStatus: 'ACTIVE',
      });

      expect(contract.contractId).toBe(12345);
      expect(contract.contract?.name).toBe('Updated IT Support Contract');
      expect(contract.contract?.contractValue).toBe(150000);
    });

    it('should throw NotFoundError for non-existent contract', async () => {
      await expect(
        client.contracts.update(999, {
          name: 'Updated Contract',
        })
      ).rejects.toThrow(SuperOpsNotFoundError);
    });
  });
});