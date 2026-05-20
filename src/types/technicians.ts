/**
 * Technician types for the SuperOps MSP API.
 *
 * Field names mirror the SuperOps GraphQL `Technician` type. See SCHEMA.md for the
 * schema reference these were derived from.
 */

/** Reference to the role a technician has. */
export interface TechnicianRole {
  roleId: string;
  name: string;
}

/** Reference to a technician group. */
export interface TechnicianGroup {
  groupId: string;
  name: string;
}

/**
 * A SuperOps technician (a user who services tickets and manages assets).
 *
 * NOTE: Some field names are unverified against live API and based on common patterns.
 */
export interface Technician {
  /** Unique technician identifier. */
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: TechnicianRole;
  status?: string;
  isActive?: boolean;
  department?: string;
  jobTitle?: string;
  timeZone?: string;
  groups?: TechnicianGroup[];
  createdDate?: string;
  modifiedDate?: string;
}

/**
 * Input for creating a new technician.
 *
 * NOTE: Field requirements unverified against live API.
 */
export interface TechnicianCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roleId?: string;
  department?: string;
  jobTitle?: string;
  timeZone?: string;
  groupIds?: string[];
}

/**
 * Input for updating an existing technician.
 *
 * NOTE: Some field names are unverified against live API.
 */
export interface TechnicianUpdateInput {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  roleId?: string;
  department?: string;
  jobTitle?: string;
  timeZone?: string;
  groupIds?: string[];
  isActive?: boolean;
}
