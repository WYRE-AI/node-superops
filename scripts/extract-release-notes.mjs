#!/usr/bin/env node
/* global process, console */
// Extracts one version's release-notes section out of CHANGELOG.md so
// PUBLISH mode's `gh release create` can use the same curated notes PREPARE
// mode already committed, instead of GitHub's generic --generate-notes
// summary (CodeRabbit catch, task_1788457898992: the two diverge in
// content -- CHANGELOG.md carries semantic-release's real notes,
// --generate-notes is GitHub's own auto-summary from commit/PR titles).
//
// FAILS OPEN, deliberately (boss's requirement): any read/parse failure or
// an empty result prints an error to stderr and exits 1. The caller must
// treat a non-zero exit as "fall back to --generate-notes" -- cosmetic
// release notes must never block a PUBLISH.

import { readFileSync } from 'node:fs';

const version = process.argv[2];
if (!version) {
  console.error('usage: extract-release-notes.mjs <version>');
  process.exit(1);
}

let changelog;
try {
  changelog = readFileSync('CHANGELOG.md', 'utf8');
} catch (err) {
  console.error(`could not read CHANGELOG.md: ${err.message}`);
  process.exit(1);
}

// semantic-release-changelog headings look like:
//   ## [1.0.12](https://github.com/.../compare/v1.0.11...v1.0.12) (2026-09-03)
// for a patch, but a single '#' for a minor/major release, e.g.:
//   # [2.0.0](https://github.com/.../compare/v1.0.2...v2.0.0) (2026-07-28)
// (murph, task_1788458278413: matching only '##' both fails to find a
// minor/major version's own section, AND fails to recognize one as the
// boundary that closes a preceding patch section -- reproduced against
// node-crewhu's real CHANGELOG.md, where extracting 2.0.1 silently
// swallowed all of the following 2.0.0 section, including its BREAKING
// CHANGES block, into 2.0.1's "notes"). Match 1 or 2 leading '#'s so both
// heading levels are recognized as section boundaries.
const lines = changelog.split('\n');
const headingRe = /^#{1,2} \[([^\]]+)\]/;
let start = -1;
let end = lines.length;

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(headingRe);
  if (!m) continue;
  if (start === -1 && m[1] === version) {
    start = i + 1; // section body starts after the heading line
  } else if (start !== -1) {
    end = i; // next heading closes the section
    break;
  }
}

if (start === -1) {
  console.error(`no CHANGELOG.md section found for version ${version}`);
  process.exit(1);
}

const section = lines.slice(start, end).join('\n').trim();

if (!section) {
  console.error(`CHANGELOG.md section for ${version} is empty`);
  process.exit(1);
}

console.log(section);
