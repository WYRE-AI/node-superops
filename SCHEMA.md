# SuperOps GraphQL Schema Reference

This document records the SuperOps MSP GraphQL schema as the SDK understands
it. It exists because the SDK was originally written against an **assumed**
schema that did not match the real API (see issue #4) — every resource needs
to be migrated to the real schema, and this file tracks that work.

**Source:** SuperOps public API documentation — <https://developer.superops.com/msp>.

**Endpoints:**

- US: `https://api.superops.ai/msp`
- EU: `https://euapi.superops.ai/msp`

> ⚠️ This reference was derived from public documentation, not from live schema
> introspection. Object-type field names are reliable; **list input shapes
> (`ListInfoInput`) and `ListInfo` field names are best-effort and should be
> confirmed against the live API.** The authoritative way to verify is a
> GraphQL introspection query against the endpoint above with a valid token.

## Pagination model

SuperOps uses **page-based** pagination, not GraphQL cursor connections:

- List queries take a `ListInfoInput!` argument.
- List responses are `<Entity>List { <entities>: [...], listInfo: ListInfo }`.
- `ListInfo` reports the page number, page size, and total record count.

The SDK exposes this as `Page<T> { items: T[]; meta: ListMeta }` and a
`PageParams { page?, pageSize? }` input. See `src/types/common.ts`.

## Assets — migrated ✅

```graphql
getAsset(input: AssetIdentifierInput!): Asset
getAssetList(input: ListInfoInput!): AssetList
updateAsset(input: UpdateAssetInput!): Asset

input AssetIdentifierInput { assetId: String! }

type Asset {
  assetId, name, status
  assetClass { classId, name }
  client { accountId, name }
  site { id, name }
  requester { userId, name }
  primaryMac, loggedInUser, serialNumber, manufacturer, model
  hostName, publicIp, gateway, platform, domain, sysUptime
  lastCommunicatedTime, agentVersion
  platformFamily, platformCategory, platformVersion, patchStatus
  warrantyExpiryDate, purchasedDate, lastReportedTime, customFields
}

type AssetList { assets: [Asset!]!, listInfo: ListInfo! }
```

## Other resources — NOT yet migrated ❌

Every other resource (`tickets`, `clients`, `sites`, `alerts`, `contracts`,
`technicians`, `knowledge-base`, …) still uses the original assumed schema and
will fail against the real API. The full query/mutation inventory and the
migration plan are tracked in the v2.0.0 GitHub issue.
