/**
 * Client types for the SuperOps MSP API.
 *
 * Field names mirror the SuperOps GraphQL `Client` type. See SCHEMA.md for the
 * schema reference these were derived from.
 */

/** Reference to a user associated with a client. */
export interface ClientUserRef {
  userId: string;
  name: string;
}

/** Reference to a site associated with a client. */
export interface ClientSiteRef {
  id: string;
  name: string;
}

/** Reference to a technician group associated with a client. */
export interface ClientTechnicianGroupRef {
  id: string;
  name: string;
}

/**
 * A SuperOps client (customer/organization).
 */
export interface Client {
  /** Unique client identifier. */
  accountId: string;
  name: string;
  stage?: string; // NOTE: unverified against live API
  status?: string; // NOTE: unverified against live API
  emailDomains?: string[];
  accountManager?: ClientUserRef;
  primaryContact?: ClientUserRef;
  secondaryContact?: ClientUserRef;
  hqSite?: ClientSiteRef;
  technicianGroups?: ClientTechnicianGroupRef[];
  customFields?: Record<string, unknown>;
}

/**
 * Input for creating a client.
 *
 * SuperOps' `createClientV2` mutation accepts these fields.
 */
export interface ClientCreateInput {
  name: string;
  stage?: string; // NOTE: unverified against live API
  status?: string; // NOTE: unverified against live API
  emailDomains?: string[];
  accountManagerId?: string; // NOTE: unverified against live API
  primaryContactId?: string; // NOTE: unverified against live API
  secondaryContactId?: string; // NOTE: unverified against live API
  hqSiteId?: string; // NOTE: unverified against live API
  technicianGroupIds?: string[]; // NOTE: unverified against live API
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating a client.
 *
 * SuperOps' `updateClient` mutation accepts these fields.
 */
export interface ClientUpdateInput {
  name?: string;
  stage?: string; // NOTE: unverified against live API
  status?: string; // NOTE: unverified against live API
  emailDomains?: string[];
  accountManagerId?: string; // NOTE: unverified against live API
  primaryContactId?: string; // NOTE: unverified against live API
  secondaryContactId?: string; // NOTE: unverified against live API
  hqSiteId?: string; // NOTE: unverified against live API
  technicianGroupIds?: string[]; // NOTE: unverified against live API
  customFields?: Record<string, unknown>;
}
