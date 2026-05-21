/**
 * Technicians integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';
import { SuperOpsNotFoundError, SuperOpsValidationError } from '../../src/errors.js';

describe('Technicians Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('list', () => {
    it('should list technicians with pagination metadata', async () => {
      const result = await client.technicians.list();

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalCount).toBe(2);
      expect(result.items[0].userId).toBe('tech-123');
      expect(result.items[0].firstName).toBe('John');
      expect(result.items[0].lastName).toBe('Smith');
      expect(result.items[0].email).toBe('john.smith@acme.com');
    });

    it('should accept page parameters', async () => {
      const result = await client.technicians.list({ page: 1, pageSize: 10 });

      expect(result.meta.pageSize).toBe(10);
    });
  });

  describe('listAll', () => {
    it('should iterate through all technicians', async () => {
      const technicians = [];

      for await (const technician of client.technicians.listAll()) {
        technicians.push(technician);
      }

      expect(technicians.length).toBe(2);
      expect(technicians[0].firstName).toBe('John');
      expect(technicians[1].firstName).toBe('Sarah');
    });

    it('should support toArray()', async () => {
      const technicians = await client.technicians.listAll().toArray();

      expect(technicians.length).toBe(2);
    });
  });

  describe('create', () => {
    it('should create a new technician', async () => {
      const technician = await client.technicians.create({
        firstName: 'Mike',
        lastName: 'Wilson',
        email: 'mike.wilson@acme.com',
        phoneNumber: '+1-555-0789',
        department: 'IT Support',
        jobTitle: 'Junior Technician',
      });

      expect(technician.userId).toBe('tech-new');
      expect(technician.firstName).toBe('Mike');
      expect(technician.lastName).toBe('Wilson');
      expect(technician.email).toBe('mike.wilson@acme.com');
      expect(technician.isActive).toBe(true);
    });

    it('should handle validation errors', async () => {
      await expect(
        client.technicians.create({
          firstName: '',
          lastName: '',
          email: '',
        })
      ).rejects.toThrow(SuperOpsValidationError);
    });
  });

  describe('update', () => {
    it('should update a technician', async () => {
      const technician = await client.technicians.update({
        userId: 'tech-123',
        firstName: 'Johnny',
        department: 'Advanced Support',
      });

      expect(technician.userId).toBe('tech-123');
      expect(technician.firstName).toBe('Johnny');
      expect(technician.department).toBe('Advanced Support');
    });

    it('should throw NotFoundError for non-existent technician', async () => {
      await expect(
        client.technicians.update({
          userId: 'not-found',
          firstName: 'Test',
        })
      ).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete a technician', async () => {
      const result = await client.technicians.delete('tech-456');

      expect(result).toBe(true);
    });

    it('should throw NotFoundError for non-existent technician', async () => {
      await expect(client.technicians.delete('not-found')).rejects.toThrow(SuperOpsNotFoundError);
    });
  });
});