/**
 * Sites integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';
import { SuperOpsNotFoundError } from '../../src/errors.js';

describe('Sites Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('get', () => {
    it('should get a single client site by ID', async () => {
      const site = await client.sites.get('site-123');

      expect(site.id).toBe('site-123');
      expect(site.name).toBe('Main Office');
      expect(site.timezoneCode).toBe('America/New_York');
      expect(site.working24x7).toBe(false);
      expect(site.hq).toBe(true);
      expect(site.client?.id).toBe('client-456');
      expect(site.client?.name).toBe('Acme Corp');
      expect(site.line1).toBe('123 Main Street');
      expect(site.city).toBe('New York');
      expect(site.countryCode).toBe('US');
    });

    it('should throw NotFoundError for non-existent site', async () => {
      await expect(client.sites.get('not-found')).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('list', () => {
    it('should list client sites with pagination metadata', async () => {
      const result = await client.sites.list();

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalCount).toBe(2);
    });

    it('should accept page parameters', async () => {
      const result = await client.sites.list({ page: 1, pageSize: 10 });

      expect(result.meta.pageSize).toBe(10);
    });
  });

  describe('listAll', () => {
    it('should iterate through all client sites', async () => {
      const sites = [];

      for await (const site of client.sites.listAll()) {
        sites.push(site);
      }

      expect(sites.length).toBe(2);
      expect(sites[0].name).toBe('Main Office');
      expect(sites[1].name).toBe('Branch Office');
    });

    it('should support toArray()', async () => {
      const sites = await client.sites.listAll().toArray();

      expect(sites.length).toBe(2);
    });
  });

  describe('create', () => {
    it('should create a new client site', async () => {
      const site = await client.sites.create({
        name: 'New Office',
        timezoneCode: 'America/Chicago',
        working24x7: false,
        line1: '789 New Street',
        city: 'Chicago',
        countryCode: 'US',
        contactNumber: '+1-555-111-2222',
        hq: false,
      });

      expect(site.id).toBe('site-new');
      expect(site.name).toBe('New Office');
      expect(site.timezoneCode).toBe('America/Chicago');
      expect(site.working24x7).toBe(false);
      expect(site.hq).toBe(false);
    });
  });

  describe('update', () => {
    it('should update an existing client site', async () => {
      const site = await client.sites.update('site-123', {
        name: 'Updated Office Name',
        timezoneCode: 'America/Denver',
        working24x7: true,
      });

      expect(site.id).toBe('site-123');
      expect(site.name).toBe('Updated Office Name');
      expect(site.timezoneCode).toBe('America/Denver');
      expect(site.working24x7).toBe(true);
    });

    it('should throw NotFoundError for non-existent site', async () => {
      await expect(
        client.sites.update('not-found', { name: 'Updated' })
      ).rejects.toThrow(SuperOpsNotFoundError);
    });
  });
});