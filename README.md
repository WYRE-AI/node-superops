# node-superops

Comprehensive, fully-typed Node.js/TypeScript library for the SuperOps.ai GraphQL API.

## Features

- **Complete API coverage** - All SuperOps.ai queries and mutations
- **Strong TypeScript types** - Full type definitions for all resources
- **GraphQL abstraction** - Method-based access without writing raw GraphQL
- **Automatic pagination** - Async iterators for page-based pagination
- **Rate limit handling** - Built-in request throttling (800 req/min)
- **Multi-region support** - US and EU endpoints for MSP and IT verticals
- **Zero live API testing** - Full test suite with mocked GraphQL responses

## Installation

```bash
npm install @wyre-ai/node-superops
```

## Quick Start

```typescript
import { SuperOpsClient } from '@wyre-ai/node-superops';

const client = new SuperOpsClient({
  apiToken: process.env.SUPEROPS_API_TOKEN!,
  customerSubDomain: process.env.SUPEROPS_SUBDOMAIN!,
  region: 'us',      // 'us' | 'eu'
  vertical: 'msp',   // 'msp' | 'it'
});

// Get an asset
const asset = await client.assets.get('asset-123');

// List tickets with pagination
const tickets = await client.tickets.list({
  page: 1,
  pageSize: 50,
});
console.log(tickets.items, tickets.meta.totalCount);

// Auto-paginate through all clients
for await (const clientRecord of client.clients.listAll()) {
  console.log(clientRecord.name);
}
```

## Configuration

```typescript
const client = new SuperOpsClient({
  // Required
  apiToken: 'your-api-token',
  customerSubDomain: 'your-company',

  // Optional - Region/Vertical (defaults to US MSP)
  region: 'us',           // 'us' | 'eu'
  vertical: 'msp',        // 'msp' | 'it'

  // OR explicit endpoint
  endpoint: 'https://api.superops.ai/msp',

  // Optional settings
  timeout: 30000,         // Request timeout in ms (default: 30000)
  dates: 'date',          // 'date' (Date objects) | 'string' (ISO strings)

  // Rate limiting configuration
  rateLimiter: {
    enabled: true,        // Enable rate limiting (default: true)
    maxRequests: 800,     // Max requests per window (default: 800)
    windowMs: 60000,      // Window duration in ms (default: 60000)
    throttleThreshold: 0.8, // Throttle at 80% (default: 0.8)
    retryAfterMs: 5000,   // Retry delay (default: 5000)
    maxRetries: 3,        // Max retries (default: 3)
  },
});
```

## Regional Endpoints

| Region | Vertical | Endpoint |
|--------|----------|----------|
| `us` | `msp` | `https://api.superops.ai/msp` |
| `us` | `it` | `https://api.superops.ai/it` |
| `eu` | `msp` | `https://euapi.superops.ai/msp` |
| `eu` | `it` | `https://euapi.superops.ai/it` |

## Resources

### Assets

```typescript
// Get single asset
const asset = await client.assets.get('asset-123');
console.log(asset.name, asset.hostName, asset.status);

// List assets, one page at a time
const result = await client.assets.list({ page: 1, pageSize: 50 });
console.log(result.items, result.meta.totalCount);

// Auto-paginate all assets
for await (const asset of client.assets.listAll()) {
  console.log(asset.name);
}

// Update an asset's custom fields
const updated = await client.assets.update('asset-123', {
  customFields: { location: 'HQ' },
});
```


### Tickets

```typescript
// Get single ticket
const ticket = await client.tickets.get('ticket-001');

// List tickets with pagination
const result = await client.tickets.list({
  page: 1,
  pageSize: 50,
});
console.log(result.items, result.meta.totalCount);

// Create ticket
const newTicket = await client.tickets.create({
  subject: 'Server not responding',
  description: 'Production server is unresponsive',
  clientId: 'client-456',
  priority: 'CRITICAL',
});

// Update ticket
await client.tickets.update('ticket-001', {
  priority: 'HIGH',
});
```

### Clients

```typescript
// Get single client
const clientRecord = await client.clients.get('client-456');

// List clients
const result = await client.clients.list({
  page: 1,
  pageSize: 50,
});
console.log(result.items, result.meta.totalCount);

// Create client
const newClient = await client.clients.create({
  name: 'New Company',
  stage: 'PROSPECT',
});

// Update client
await client.clients.update('client-456', {
  name: 'Updated Company Name',
});
```

### Sites

```typescript
// Get site
const site = await client.sites.get('site-789');

// List sites
const sites = await client.sites.list({
  page: 1,
  pageSize: 50,
});
console.log(sites.items, sites.meta.totalCount);

// Create site
const newSite = await client.sites.create({
  name: 'Branch Office',
  line1: '456 Oak Ave',
  city: 'Othertown',
  stateCode: 'CA',
  postalCode: '54321',
  clientId: 'client-456',
});

// Update site
await client.sites.update('site-789', {
  name: 'Updated Branch Name',
});
```

### Alerts

```typescript
// List alerts
const alerts = await client.alerts.list({
  page: 1,
  pageSize: 50,
});
console.log(alerts.items, alerts.meta.totalCount);

// List alerts for a specific asset
const assetAlerts = await client.alerts.listByAsset('asset-123', {
  page: 1,
  pageSize: 50,
});

// Create alert
const newAlert = await client.alerts.create({
  message: 'Disk Space Low',
  description: 'Drive C: is at 95% capacity',
  severity: 'WARNING',
  assetId: 'asset-123',
});

// Resolve alerts
await client.alerts.resolve({
  alertIds: ['alert-001'],
  resolutionNote: 'Issue resolved',
});
```

### Knowledge Base

```typescript
// Get a KB item (article or collection)
const item = await client.knowledgeBase.get('item-123');

// List KB items
const items = await client.knowledgeBase.list({
  page: 1,
  pageSize: 50,
});
console.log(items.items, items.meta.totalCount);

// Create article
const newArticle = await client.knowledgeBase.createArticle({
  name: 'How to Reset Passwords',
  description: 'Step-by-step password reset guide',
  parentId: 'collection-456',
});

// Create collection
const newCollection = await client.knowledgeBase.createCollection({
  name: 'How-To Guides',
  description: 'Step-by-step guides',
});

// Update article
await client.knowledgeBase.updateArticle({
  itemId: 'article-123',
  name: 'Updated Password Reset Guide',
  description: 'Updated password reset steps',
});

// Delete article
await client.knowledgeBase.deleteArticle({
  itemId: 'article-123',
});
```

### Contracts

```typescript
// Get contract
const contract = await client.contracts.get('contract-123');

// List contracts
const contracts = await client.contracts.list({
  page: 1,
  pageSize: 50,
});
console.log(contracts.items, contracts.meta.totalCount);

// Create contract
const newContract = await client.contracts.create({
  clientId: 'client-456',
  name: 'Annual Support Contract',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
});

// Update contract
await client.contracts.update('contract-123', {
  name: 'Updated Contract Name',
});
```

### Technicians

```typescript
// List technicians
const technicians = await client.technicians.list({
  page: 1,
  pageSize: 50,
});
console.log(technicians.items, technicians.meta.totalCount);

// Create technician
const newTechnician = await client.technicians.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  role: 'Technician',
});

// Update technician
await client.technicians.update('tech-001', {
  phoneNumber: '+1-555-0123',
});
```

## Pagination

SuperOps.ai uses page-based pagination. The library provides async iterators for automatic pagination:

```typescript
// Auto-paginate all results
for await (const asset of client.assets.listAll()) {
  console.log(asset.name);
}

// Collect all into an array
const allAssets = await client.assets.listAll().toArray();

// Custom page size for auto-pagination
for await (const ticket of client.tickets.listAll({ pageSize: 100 })) {
  console.log(ticket.subject);
}
```

## Error Handling

The library provides typed error classes:

```typescript
import {
  SuperOpsError,
  SuperOpsAuthenticationError,
  SuperOpsNotFoundError,
  SuperOpsValidationError,
  SuperOpsRateLimitError,
  SuperOpsServerError,
} from '@wyre-ai/node-superops';

try {
  await client.assets.get('non-existent');
} catch (error) {
  if (error instanceof SuperOpsNotFoundError) {
    console.log('Asset not found');
  } else if (error instanceof SuperOpsAuthenticationError) {
    console.log('Check your API token');
  } else if (error instanceof SuperOpsValidationError) {
    console.log('Validation errors:', error.validationErrors);
  } else if (error instanceof SuperOpsRateLimitError) {
    console.log('Rate limited, retry after:', error.retryAfter);
  }
}
```

## Rate Limiting

The library automatically handles SuperOps.ai's 800 requests per minute limit:

- Tracks requests in a rolling window
- Throttles when approaching the limit
- Automatically retries on rate limit errors
- Configurable thresholds and delays

```typescript
// Check rate limit status
const status = client.getRateLimitStatus();
console.log(`Remaining: ${status.remaining}/${status.maxRequests}`);
console.log(`Throttling: ${status.isThrottling}`);
```

## License

Apache-2.0

## Author

Aaron Sachs / WYRE Technology
