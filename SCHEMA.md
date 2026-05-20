# SuperOps GraphQL Schema Reference

This document records how the SDK maps onto the SuperOps MSP GraphQL API. It
exists because the SDK was originally written against an **assumed** schema
that did not match the real API (see issue #4).

**Source:** SuperOps public API documentation — <https://developer.superops.com/msp>.

**Endpoints:**

- US: `https://api.superops.ai/msp`
- EU: `https://euapi.superops.ai/msp`

> ⚠️ **Verification caveat.** This SDK was corrected from public documentation,
> not from live schema introspection (no API tenant was available). Query
> names, the `input:` argument convention, and object-type field names are
> well-corroborated. **Input-type field names — especially `ListInfoInput` and
> create/update inputs — are best-effort and may need adjustment against a
> live tenant.** Such spots are flagged with `// NOTE: unverified against live
> API` comments in the source. The authoritative way to confirm is a GraphQL
> introspection query against the endpoint with a valid token.

## Pagination model

SuperOps uses **page-based** pagination, not GraphQL cursor connections:

- List queries take a `ListInfoInput!` argument carrying `page` / `pageSize`.
- List responses are `<Entity>List { <entities>: [...], listInfo: ListInfo }`.
- `ListInfo` reports the page number, page size, and total record count.

The SDK exposes this as `Page<T> { items: T[]; meta: ListMeta }` with a
`PageParams { page?, pageSize? }` input, and an auto-paginating `listAll()`
iterator. See `src/types/common.ts` and `src/pagination.ts`.

## Migrated resources ✅

All operations use SuperOps' `input:` argument convention and page-based lists.
The corrected GraphQL queries live in each `src/resources/*.ts` file, which —
together with the matching `src/types/*.ts` — is the authoritative reference
for what the SDK sends.

| Resource | SuperOps queries/mutations |
|----------|----------------------------|
| `assets` | `getAsset`, `getAssetList`, `updateAsset` |
| `tickets` | `getTicket`, `getTicketList`, `createTicket`, `updateTicket` |
| `clients` | `getClient`, `getClientList`, `createClientV2`, `updateClient` |
| `sites` | `getClientSite`, `getClientSiteList`, `createClientSite`, `updateClientSite` |
| `alerts` | `getAlertList`, `getAlertsForAsset`, `createAlert`, `resolveAlerts` |
| `contracts` | `getClientContract`, `getClientContractList`, `createClientContract`, `updateClientContract` |
| `technicians` | `getTechnicianList`, `createTechnician`, `updateTechnician`, `deleteTechnician` |
| `knowledgeBase` | `getKbItem`, `getKbItems`, `create/update/deleteKbArticle`, `create/update/deleteKbCollection` |

## Removed resources

`runbooks`, `patches`, `remoteSessions`, and `reports` were removed in v2. They
were built entirely on the assumed schema and have no clear standalone
equivalent in the SuperOps MSP API. Patch data (`getAssetPatchDetails`,
`getAssetPatchStatus`) and scripts (`getScriptList`) do exist as asset-scoped
operations and may be reintroduced later if scoped correctly.

## Test mocks

`tests/mocks/handlers/` holds one MSW handler file per resource. The mocks
mirror the SDK's queries so unit/integration tests verify the SDK's request
and parsing logic — they do **not** verify the schema against a live API.
That gap is what the verification caveat above refers to.
