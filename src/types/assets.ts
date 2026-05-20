/**
 * Asset types for the SuperOps MSP API.
 *
 * Field names mirror the SuperOps GraphQL `Asset` type. See SCHEMA.md for the
 * schema reference these were derived from.
 */

/** Reference to the asset class an asset belongs to. */
export interface AssetClass {
  classId: string;
  name: string;
}

/** Reference to the client that owns an asset. */
export interface AssetClientRef {
  accountId: string;
  name: string;
}

/** Reference to the site an asset is located at. */
export interface AssetSiteRef {
  id: string;
  name: string;
}

/** Reference to the requester (user) associated with an asset. */
export interface AssetRequesterRef {
  userId: string;
  name: string;
}

/**
 * A SuperOps asset (a managed device).
 */
export interface Asset {
  /** Unique asset identifier. */
  assetId: string;
  name: string;
  assetClass?: AssetClass;
  client?: AssetClientRef;
  site?: AssetSiteRef;
  requester?: AssetRequesterRef;
  primaryMac?: string;
  loggedInUser?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  hostName?: string;
  publicIp?: string;
  gateway?: string;
  platform?: string;
  domain?: string;
  status?: string;
  sysUptime?: string;
  lastCommunicatedTime?: string;
  agentVersion?: string;
  platformFamily?: string;
  platformCategory?: string;
  platformVersion?: string;
  patchStatus?: string;
  warrantyExpiryDate?: string;
  purchasedDate?: string;
  lastReportedTime?: string;
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating an asset.
 *
 * SuperOps' `updateAsset` mutation only supports updating an asset's custom
 * fields via the public API.
 */
export interface AssetUpdateInput {
  customFields?: Record<string, unknown>;
}
