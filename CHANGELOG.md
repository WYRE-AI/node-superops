# [3.1.0](https://github.com/WYRE-AI/node-superops/compare/v3.0.4...v3.1.0) (2026-09-04)


### Features

* **release:** use extracted CHANGELOG notes instead of --generate-notes ([#85](https://github.com/WYRE-AI/node-superops/issues/85)) ([f5f3ddc](https://github.com/WYRE-AI/node-superops/commit/f5f3ddc9ba8a768d7a6c3197275c0fedf359a57d)), closes [node-datto-rmm#77](https://github.com/node-datto-rmm/issues/77)





## [3.0.4](https://github.com/WYRE-AI/node-superops/compare/v3.0.3...v3.0.4) (2026-09-04)


### Bug Fixes

* **release:** restore persist-credentials:false, re-auth only for release ops ([#84](https://github.com/WYRE-AI/node-superops/issues/84)) ([0cf9581](https://github.com/WYRE-AI/node-superops/commit/0cf9581b2a4bfae678503b31f8eb0d469b7b346f))
* **security:** resolve dependabot alerts via npm audit fix ([#81](https://github.com/WYRE-AI/node-superops/issues/81)) ([2fb01ee](https://github.com/WYRE-AI/node-superops/commit/2fb01eef92871a469fea48ee3e4303bd7572d6c6))





## [3.0.3](https://github.com/WYRE-AI/node-superops/compare/v3.0.2...v3.0.3) (2026-08-25)


### Bug Fixes

* **deps:** ignore undici in dependabot -- nested unreachable copy in npm's bundled tree ([#76](https://github.com/WYRE-AI/node-superops/issues/76)) ([ba70a43](https://github.com/WYRE-AI/node-superops/commit/ba70a43a979b4d3cc9946f902fba8eacc7ffca77))
* migrate to WYRE-AI org (npm scope, ghcr namespace, registry) ([#78](https://github.com/WYRE-AI/node-superops/issues/78)) ([85d6e22](https://github.com/WYRE-AI/node-superops/commit/85d6e22060fc15247ba61d6109bff46b4e790f25))

## [3.0.2](https://github.com/WYRE-AI/node-superops/compare/v3.0.1...v3.0.2) (2026-08-06)


### Bug Fixes

* **deps:** ignore unreachable ip-address advisory in dependabot config ([#69](https://github.com/WYRE-AI/node-superops/issues/69)) ([40d3bb4](https://github.com/WYRE-AI/node-superops/commit/40d3bb4d456c7825764aa768e423020d194149b0))

## [3.0.1](https://github.com/WYRE-AI/node-superops/compare/v3.0.0...v3.0.1) (2026-06-22)


### Bug Fixes

* **tsconfig:** restore include/exclude globs ([#45](https://github.com/WYRE-AI/node-superops/issues/45)) ([4c8a74f](https://github.com/WYRE-AI/node-superops/commit/4c8a74f1a0e01afa6851fb95636ceb27921060a5))

# [3.0.0](https://github.com/WYRE-AI/node-superops/compare/v2.0.0...v3.0.0) (2026-05-21)


### Features

* migrate all resources to the real SuperOps GraphQL schema ([#9](https://github.com/WYRE-AI/node-superops/issues/9)) ([193786c](https://github.com/WYRE-AI/node-superops/commit/193786ce5a9f1b5335ea5c3362ee6ffc03809eb6)), closes [#7](https://github.com/WYRE-AI/node-superops/issues/7)


### BREAKING CHANGES

* all resource APIs changed to match SuperOps' real
GraphQL schema; list methods return page-based Page<T>; the runbooks,
patches, remoteSessions and reports resources were removed.

# [2.0.0](https://github.com/WYRE-AI/node-superops/compare/v1.0.5...v2.0.0) (2026-05-20)


### Bug Fixes

* rewrite assets resource against the real SuperOps schema ([#8](https://github.com/WYRE-AI/node-superops/issues/8)) ([f61fe25](https://github.com/WYRE-AI/node-superops/commit/f61fe2528815525232c479bb3f3b33fcb2c5bf5f)), closes [#4](https://github.com/WYRE-AI/node-superops/issues/4)


### BREAKING CHANGES

* assets resource API and the Asset type changed to match
SuperOps' real GraphQL schema; assets.list() now returns a page-based
Page<Asset> instead of a cursor Connection.

## [1.0.5](https://github.com/WYRE-AI/node-superops/compare/v1.0.4...v1.0.5) (2026-05-20)


### Bug Fixes

* correct exports map and add package smoke test ([#3](https://github.com/WYRE-AI/node-superops/issues/3)) ([d36fdd8](https://github.com/WYRE-AI/node-superops/commit/d36fdd861ced3dcf09cb7869918deecbffad6464)), closes [#2](https://github.com/WYRE-AI/node-superops/issues/2)

## [1.0.4](https://github.com/WYRE-AI/node-superops/compare/v1.0.3...v1.0.4) (2026-03-02)


### Bug Fixes

* require Node 22+ (semantic-release@25 compatibility) ([d8b98da](https://github.com/WYRE-AI/node-superops/commit/d8b98dac8284c93ae3f644ed2199d54ff5691191))
* require Node 22+ (semantic-release@25 compatibility) ([4f80032](https://github.com/WYRE-AI/node-superops/commit/4f8003260176c3b234a63ce01df85b7bb9558448))

## [1.0.3](https://github.com/asachs01/node-superops/compare/v1.0.2...v1.0.3) (2026-02-05)


### Bug Fixes

* Add varsIgnorePattern to ESLint config for unused destructured vars ([4f73099](https://github.com/asachs01/node-superops/commit/4f73099f037dcc322767200d6842ce0334fc726b))
* Prefix unused variables with underscore to satisfy ESLint ([d55ada8](https://github.com/asachs01/node-superops/commit/d55ada8ca48ead7b133bf0bec7a2240e76577e7d))

## [1.0.2](https://github.com/asachs01/node-superops/compare/v1.0.1...v1.0.2) (2026-02-05)


### Bug Fixes

* Downgrade to ESLint 8.x for .eslintrc.json compatibility ([d528860](https://github.com/asachs01/node-superops/commit/d528860453b336a21a3f931c5fff882abbf5149e))

## [1.0.1](https://github.com/asachs01/node-superops/compare/v1.0.0...v1.0.1) (2026-02-05)


### Bug Fixes

* Add missing ESLint dependencies ([ba19525](https://github.com/asachs01/node-superops/commit/ba19525245060c06823478a45de5eaec7c859342))

# 1.0.0 (2026-02-05)


### Bug Fixes

* Add semantic-release plugins as devDependencies ([77ed655](https://github.com/asachs01/node-superops/commit/77ed65593d7d2e652b27d14d1c8a5b005822812e))


### Features

* Add semantic-release for GitHub Packages publishing ([6221a7f](https://github.com/asachs01/node-superops/commit/6221a7f61c8b689b240b0fe33f242228b24605dc))
* Initial release of node-superops TypeScript library ([443c430](https://github.com/asachs01/node-superops/commit/443c43094ca61eecf3e22489eed161a4d441f695))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-04

### Added

- Initial release of node-superops
- Complete TypeScript library for SuperOps.ai GraphQL API
- Core functionality:
  - SuperOpsClient main client class
  - GraphQL client with authentication
  - Rate limiter (800 req/min)
  - Cursor-based pagination with async iterators
  - Typed error classes
- Resource implementations:
  - Assets - CRUD operations, list by client/site
  - Tickets - CRUD, notes, time entries, status changes, assignments
  - Clients - CRUD, search, archive
  - Sites - CRUD, list by client
  - Alerts - List, acknowledge, resolve, dismiss
  - Contracts - CRUD, renewal
  - Technicians - List, availability
  - Knowledge Base - Articles, collections, search
  - Runbooks - List, execute, status
  - Patches - List, approve, schedule deployments
  - Remote Sessions - Initiate, terminate
  - Reports - Ticket metrics, asset summary, technician performance, health scores
- Multi-region support (US/EU for MSP/IT verticals)
- Full test suite with MSW mocks
- Comprehensive TypeScript types
- README documentation with examples

[Unreleased]: https://github.com/asachs01/node-superops/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/asachs01/node-superops/releases/tag/v0.1.0
