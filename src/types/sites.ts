/**
 * Client Site types for the SuperOps MSP API.
 *
 * Field names mirror the SuperOps GraphQL `ClientSite` type. See SCHEMA.md for the
 * schema reference these were derived from.
 */

/** Business hour configuration for a site. */
export interface SiteBusinessHour {
  // NOTE: unverified against live API - business hour structure not detailed in docs
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  isWorkingDay?: boolean;
}

/** Holiday list configuration for a site. */
export interface SiteHolidayList {
  // NOTE: unverified against live API - holiday structure not detailed in docs
  id?: string;
  name?: string;
}

/** Installer information for a site. */
export interface SiteInstallerInfo {
  // NOTE: unverified against live API - installer structure not detailed in docs
  id?: string;
  name?: string;
  contactNumber?: string;
}

/** Reference to the client that owns a site. */
export interface SiteClientRef {
  // NOTE: unverified against live API - client reference structure assumed
  id: string;
  name?: string;
}

/**
 * A SuperOps client site.
 */
export interface Site {
  /** Unique site identifier. */
  id: string;
  name: string;
  timezoneCode?: string;
  working24x7?: boolean;
  businessHour?: SiteBusinessHour[];
  holidayList?: SiteHolidayList;

  // Address fields
  line1?: string;
  line2?: string;
  line3?: string;
  city?: string;
  postalCode?: string;
  countryCode?: string;
  stateCode?: string;

  contactNumber?: string;
  client?: SiteClientRef;
  hq?: boolean; // is headquarters
  installerInfo?: SiteInstallerInfo[];
}

/**
 * Input for creating a client site.
 */
export interface SiteCreateInput {
  name: string;
  timezoneCode?: string;
  working24x7?: boolean;

  // Address fields
  line1?: string;
  line2?: string;
  line3?: string;
  city?: string;
  postalCode?: string;
  countryCode?: string;
  stateCode?: string;

  contactNumber?: string;
  hq?: boolean;
  // NOTE: unverified against live API - complex nested fields may have different input structure
  businessHour?: SiteBusinessHour[];
  installerInfo?: SiteInstallerInfo[];
}

/**
 * Input for updating a client site.
 */
export interface SiteUpdateInput {
  name?: string;
  timezoneCode?: string;
  working24x7?: boolean;

  // Address fields
  line1?: string;
  line2?: string;
  line3?: string;
  city?: string;
  postalCode?: string;
  countryCode?: string;
  stateCode?: string;

  contactNumber?: string;
  hq?: boolean;
  // NOTE: unverified against live API - complex nested fields may have different input structure
  businessHour?: SiteBusinessHour[];
  installerInfo?: SiteInstallerInfo[];
}
