#!/usr/bin/env node
/* global process, console */
// Phase 1 of the PR-based release flow (task_1788457898992, Aaron ruling
// "pipeline: pr-flow"). Computes the next version + release notes via
// semantic-release's own Node API in --dry-run mode -- this is the safe,
// documented, side-effect-free primitive (no git write, no tag push, no npm
// publish, no GitHub release; verified this is a real behavioral guarantee
// of dry-run, not something this script has to enforce itself). Bumps
// package.json and CHANGELOG.md locally so the caller workflow can commit
// them to a PR branch instead of semantic-release's own @semantic-release/git
// pushing straight to protected main (GH006).
//
// Writes GITHUB_OUTPUT keys: release_needed, version. Notes are written to
// CHANGELOG.md directly (same as @semantic-release/changelog would) rather
// than passed through GITHUB_OUTPUT, since release notes can contain
// characters/length that don't survive that path cleanly.
//
// insertReleaseNotes is header-aware (fleet-wide changelogTitle-orphaning
// fix, 2026-10-12, CodeRabbit catch on the sweep that first tried fixing
// this via .releaserc.json's changelogTitle alone): dryRun:true skips
// semantic-release's own `prepare` lifecycle step entirely, so
// @semantic-release/changelog's changelogTitle-aware insert logic never
// runs in this flow -- changelogTitle config has zero effect here. This
// function is what actually has to recognize an existing title/preamble/
// Unreleased scaffold and keep new notes below it instead of prepending at
// column zero every release.
import semanticRelease from "semantic-release";
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export function insertReleaseNotes(notes, existing) {
  if (!existing) {
    return `${notes}\n`;
  }
  // A real release heading always looks like "## [X.Y.Z](...)" (every
  // release after the first) or "# X.Y.Z (date)" (the bare first release,
  // no link). Anything before the first such heading is header scaffold
  // (title, preamble, an optional "## [Unreleased]" marker) that must stay
  // above new notes rather than being pushed below them.
  //
  // Must require a DIGIT right after "## [" -- a bare "/^## \[/" also
  // matches "## [Unreleased]" itself, which sits inside the scaffold, not
  // after it. Matching on it would treat the Unreleased line as "the first
  // real entry" and insert new notes BETWEEN the preamble and the
  // Unreleased marker, pushing Unreleased below the new entry instead of
  // leaving it above (caught by a real test against this exact file, not
  // by re-reading the regex: case2's "Unreleased precedes new entry"
  // assertion failed with the unqualified version first written).
  const headingRe = /^(## \[\d|# \d+\.\d+\.\d+ )/m;
  const match = headingRe.exec(existing);
  if (!match) {
    // No release heading anywhere -- header-only scaffold with no releases
    // yet, or an unrecognized shape. Append after whatever's there rather
    // than guessing further.
    return `${existing.trimEnd()}\n\n${notes}\n`;
  }
  if (match.index === 0) {
    // No scaffold before the first entry -- original prepend behavior,
    // unchanged for any repo that doesn't have this header pattern.
    return `${notes}\n\n${existing}`.trimEnd() + "\n";
  }
  const header = existing.slice(0, match.index).trimEnd();
  const rest = existing.slice(match.index);
  return `${header}\n\n${notes}\n\n${rest}`.trimEnd() + "\n";
}

async function main() {
  const result = await semanticRelease({ dryRun: true, ci: false });

  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!result) {
    console.log("No release needed.");
    if (githubOutput) appendFileSync(githubOutput, "release_needed=false\n");
    process.exit(0);
  }

  const { version, notes } = result.nextRelease;
  console.log(`Next release: ${version}`);

  // Bump package.json without creating a git tag or committing -- pure file
  // write, same command @semantic-release/npm uses internally for this step.
  execSync(`npm version ${version} --no-git-tag-version --allow-same-version`, {
    stdio: "inherit",
  });

  const changelogPath = "CHANGELOG.md";
  let existing = "";
  try {
    existing = readFileSync(changelogPath, "utf8");
  } catch {
    // No CHANGELOG.md yet -- fine, this is the first entry.
  }
  writeFileSync(changelogPath, insertReleaseNotes(notes, existing));

  if (githubOutput) {
    appendFileSync(githubOutput, "release_needed=true\n");
    appendFileSync(githubOutput, `version=${version}\n`);
  }
}

// Compare as filesystem paths, not as import.meta.url vs. a naively
// file://-prefixed argv[1] -- import.meta.url is URL-encoded (a space
// becomes %20, a # becomes %23), so a checkout path containing either
// would make the naive string comparison fail silently and never invoke
// main() at all. fileURLToPath decodes it back to a real path first.
// (CodeRabbit catch, fleet-wide changelogTitle sweep -- caught on CI's own
// checkout path shape being safe today, not on this ever having failed.)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
