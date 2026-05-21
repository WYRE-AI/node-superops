/**
 * Tickets integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';
import { SuperOpsNotFoundError } from '../../src/errors.js';

describe('Tickets Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('get', () => {
    it('should get a single ticket by ID', async () => {
      const ticket = await client.tickets.get('ticket-123');

      expect(ticket.ticketId).toBe('ticket-123');
      expect(ticket.subject).toBe('Network connectivity issue');
      expect(ticket.status).toBe('OPEN');
      expect(ticket.priority).toBe('HIGH');
      expect(ticket.ticketType).toBe('INCIDENT');
      expect(ticket.client?.accountId).toBe('client-456');
      expect(ticket.client?.name).toBe('Acme Corp');
    });

    it('should throw NotFoundError for non-existent ticket', async () => {
      await expect(client.tickets.get('not-found')).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('list', () => {
    it('should list tickets with pagination metadata', async () => {
      const result = await client.tickets.list();

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalCount).toBe(2);
    });

    it('should accept page parameters', async () => {
      const result = await client.tickets.list({ page: 1, pageSize: 10 });

      expect(result.meta.pageSize).toBe(10);
    });
  });

  describe('listAll', () => {
    it('should iterate through all tickets', async () => {
      const tickets = [];

      for await (const ticket of client.tickets.listAll()) {
        tickets.push(ticket);
      }

      expect(tickets.length).toBe(2);
      expect(tickets[0].subject).toBe('Network connectivity issue');
      expect(tickets[1].subject).toBe('Software installation request');
    });

    it('should support toArray()', async () => {
      const tickets = await client.tickets.listAll().toArray();

      expect(tickets.length).toBe(2);
    });
  });

  describe('create', () => {
    it('should create a new ticket', async () => {
      const ticket = await client.tickets.create({
        subject: 'New Issue',
        priority: 'MEDIUM',
        clientId: 'client-456',
      });

      expect(ticket.ticketId).toBe('ticket-new');
      expect(ticket.subject).toBe('New Issue');
    });
  });

  describe('update', () => {
    it('should update a ticket', async () => {
      const ticket = await client.tickets.update('ticket-123', {
        subject: 'Updated subject',
        customFields: { location: 'Building A' },
      });

      expect(ticket.ticketId).toBe('ticket-123');
      expect(ticket.subject).toBe('Updated subject');
      expect(ticket.customFields).toEqual({ location: 'Building A' });
    });
  });
});