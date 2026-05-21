/**
 * Ticket types for the SuperOps MSP API.
 *
 * Field names mirror the SuperOps GraphQL `Ticket` type. See SCHEMA.md for the
 * schema reference these were derived from.
 */

/** Reference to the client that owns a ticket. */
export interface TicketClientRef {
  accountId?: string;
  name?: string;
}

/** Reference to the site where a ticket is located. */
export interface TicketSiteRef {
  id?: string;
  name?: string;
}

/** Reference to a user (requester, technician, etc.). */
export interface TicketUserRef {
  userId?: string;
  name?: string;
  email?: string;
}

/** Reference to a technician group. */
export interface TicketTechGroupRef {
  id?: string;
  name?: string;
}

/** SLA information for a ticket. */
export interface TicketSLA {
  id?: string;
  name?: string;
  // NOTE: unverified against live API - may have additional fields
}

/**
 * A SuperOps ticket (service request/incident).
 */
export interface Ticket {
  /** Unique ticket identifier. */
  ticketId: string;
  /** Display ID shown in UI. */
  displayId?: string;
  subject: string;
  ticketType?: string;
  requestType?: string;
  source?: string;
  client?: TicketClientRef;
  site?: TicketSiteRef;
  requester?: TicketUserRef;
  additionalRequester?: TicketUserRef[];
  followers?: Record<string, unknown>;
  techGroup?: TicketTechGroupRef;
  technician?: TicketUserRef;
  status?: string;
  priority?: string;
  impact?: string;
  urgency?: string;
  category?: string;
  subcategory?: string;
  cause?: string;
  subcause?: string;
  resolutionCode?: string;
  sla?: TicketSLA;
  createdTime?: string;
  updatedTime?: string;
  firstResponseDueTime?: string;
  firstResponseTime?: string;
  firstResponseViolated?: boolean;
  resolutionDueTime?: string;
  resolutionTime?: string;
  resolutionViolated?: boolean;
  customFields?: Record<string, unknown>;
  worklogTimespent?: string;
}

/**
 * Input for creating a ticket.
 */
export interface TicketCreateInput {
  subject: string;
  ticketType?: string;
  requestType?: string;
  source?: string;
  clientId?: string;
  siteId?: string;
  requesterId?: string;
  technicianId?: string;
  techGroupId?: string;
  priority?: string;
  impact?: string;
  urgency?: string;
  category?: string;
  subcategory?: string;
  customFields?: Record<string, unknown>;
  // NOTE: unverified against live API - field names may vary
}

/**
 * Input for updating a ticket.
 */
export interface TicketUpdateInput {
  subject?: string;
  ticketType?: string;
  requestType?: string;
  source?: string;
  clientId?: string;
  siteId?: string;
  requesterId?: string;
  technicianId?: string;
  techGroupId?: string;
  status?: string;
  priority?: string;
  impact?: string;
  urgency?: string;
  category?: string;
  subcategory?: string;
  cause?: string;
  subcause?: string;
  resolutionCode?: string;
  customFields?: Record<string, unknown>;
  // NOTE: unverified against live API - field names may vary
}