/**
 * Alerts integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';

describe('Alerts Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('list', () => {
    it('should list alerts with pagination metadata', async () => {
      const result = await client.alerts.list();

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalCount).toBe(2);
    });

    it('should accept page parameters', async () => {
      const result = await client.alerts.list({ page: 1, pageSize: 10 });

      expect(result.meta.pageSize).toBe(10);
    });
  });

  describe('listAll', () => {
    it('should iterate through all alerts', async () => {
      const alerts = [];

      for await (const alert of client.alerts.listAll()) {
        alerts.push(alert);
      }

      expect(alerts.length).toBe(2);
      expect(alerts[0].message).toBe('High CPU Usage Detected');
      expect(alerts[1].message).toBe('Disk Space Low');
    });

    it('should support toArray()', async () => {
      const alerts = await client.alerts.listAll().toArray();

      expect(alerts.length).toBe(2);
    });
  });

  describe('listByAsset', () => {
    it('should list alerts for a specific asset', async () => {
      const result = await client.alerts.listByAsset('asset-123');

      expect(result.items.length).toBe(1);
      expect(result.items[0].asset?.assetId).toBe('asset-123');
    });

    it('should return empty list for asset with no alerts', async () => {
      const result = await client.alerts.listByAsset('asset-nonexistent');

      expect(result.items.length).toBe(0);
    });
  });

  describe('create', () => {
    it('should create a new alert', async () => {
      const alert = await client.alerts.create({
        message: 'Test Alert',
        description: 'This is a test alert',
        severity: 'Warning',
        assetId: 'asset-123',
      });

      expect(alert.id).toBe('alert-new');
      expect(alert.message).toBe('Test Alert');
      expect(alert.severity).toBe('Warning');
    });
  });

  describe('resolve', () => {
    it('should resolve multiple alerts', async () => {
      const alerts = await client.alerts.resolve({
        alertIds: ['alert-123', 'alert-456'],
      });

      expect(alerts.length).toBe(2);
      expect(alerts[0].status).toBe('Resolved');
      expect(alerts[0].resolvedTime).toBeDefined();
    });
  });
});
