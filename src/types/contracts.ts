/**
 * Contract types for the SuperOps MSP API.
 *
 * Field names mirror the SuperOps GraphQL `ClientContract` type. See SCHEMA.md for the
 * schema reference these were derived from.
 */

/** Contract status enumeration. */
export type ContractStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';

/** Contract billing cycle enumeration. */
export type ContractBillingCycle = 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY' | 'ONE_TIME';

/** Reference to the client that owns a contract. */
export interface ContractClientRef {
  accountId: string;
  name: string;
}

/** Nested contract details within a ClientContract. */
export interface ContractDetails {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  contractStatus: ContractStatus;
  contractValue?: number;
  currency?: string;
  billingCycle?: ContractBillingCycle;
  autoRenew?: boolean;
  customFields?: Record<string, unknown>;
}

/**
 * A SuperOps client contract.
 */
export interface Contract {
  /** Unique contract identifier. */
  contractId: number;
  client?: ContractClientRef;
  contract?: ContractDetails;
  startDate: string;
  endDate?: string;
  contractStatus: ContractStatus;
}

/**
 * Input for creating a client contract.
 *
 * NOTE: unverified against live API - field names derived from documentation.
 */
export interface ContractCreateInput {
  clientId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  contractValue?: number;
  currency?: string;
  billingCycle?: ContractBillingCycle;
  autoRenew?: boolean;
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating a client contract.
 *
 * NOTE: unverified against live API - field names derived from documentation.
 */
export interface ContractUpdateInput {
  contractId?: number;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  contractValue?: number;
  currency?: string;
  billingCycle?: ContractBillingCycle;
  autoRenew?: boolean;
  contractStatus?: ContractStatus;
  customFields?: Record<string, unknown>;
}