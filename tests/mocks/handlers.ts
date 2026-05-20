/**
 * MSW GraphQL handlers for the SuperOps API.
 *
 * Handlers are split per resource under ./handlers/. This file only
 * aggregates them.
 */

import { assetHandlers } from './handlers/assets.js';
import { ticketHandlers } from './handlers/tickets.js';
import { clientHandlers } from './handlers/clients.js';
import { siteHandlers } from './handlers/sites.js';
import { alertHandlers } from './handlers/alerts.js';
import { contractHandlers } from './handlers/contracts.js';
import { technicianHandlers } from './handlers/technicians.js';
import { knowledgeBaseHandlers } from './handlers/knowledge-base.js';
import { miscHandlers } from './handlers/misc.js';

export const handlers = [
  ...assetHandlers,
  ...ticketHandlers,
  ...clientHandlers,
  ...siteHandlers,
  ...alertHandlers,
  ...contractHandlers,
  ...technicianHandlers,
  ...knowledgeBaseHandlers,
  ...miscHandlers,
];
