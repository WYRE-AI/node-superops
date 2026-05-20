/**
 * Alert types for the SuperOps MSP API.
 *
 * Field names mirror the SuperOps GraphQL `Alert` type. See SCHEMA.md for the
 * schema reference these were derived from.
 */

/** Reference to the asset associated with an alert. */
export interface AlertAssetRef {
  // NOTE: unverified against live API - assuming assetId based on other ref patterns
  assetId?: string;
  name?: string;
}

/** Reference to the monitoring policy that triggered an alert. */
export interface AlertPolicyRef {
  // NOTE: unverified against live API - assuming standard ref pattern
  id?: string;
  name?: string;
}

/**
 * A SuperOps alert.
 *
 * Field names match the SuperOps GraphQL `Alert` type.
 */
export interface Alert {
  /** Unique alert identifier */
  id: string;
  /** Alert title/summary message */
  message: string;
  /** Detailed description of the alert */
  description?: string;
  /** Alert severity level */
  severity: string;
  /** Current alert status */
  status: string;
  /** When the alert was created */
  createdTime: string;
  /** When the alert was resolved (if applicable) */
  resolvedTime?: string;
  /** Associated asset information */
  asset?: AlertAssetRef;
  /** Monitoring policy that triggered this alert */
  policy?: AlertPolicyRef;
}

/**
 * Input for creating a new alert.
 */
export interface AlertCreateInput {
  /** Alert message/title */
  message: string;
  /** Detailed description */
  description?: string;
  /** Alert severity */
  severity: string;
  /** Asset to associate with the alert */
  assetId?: string;
  // NOTE: unverified against live API - other fields may be required/available
}

/**
 * Input for resolving alerts.
 */
export interface AlertResolveInput {
  /** Alert IDs to resolve */
  alertIds: string[];
  // NOTE: unverified against live API - may have additional fields like resolution reason
}
