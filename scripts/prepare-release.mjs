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
import semanticRelease from "semantic-release";
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { execSync } from "node:child_process";

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

// Prepend to CHANGELOG.md, matching @semantic-release/changelog's own
// convention (newest release on top) so this stays a drop-in for repos that
// already have history in this format.
const changelogPath = "CHANGELOG.md";
let existing = "";
try {
  existing = readFileSync(changelogPath, "utf8");
} catch {
  // No CHANGELOG.md yet -- fine, this is the first entry.
}
writeFileSync(changelogPath, `${notes}\n\n${existing}`.trimEnd() + "\n");

if (githubOutput) {
  appendFileSync(githubOutput, "release_needed=true\n");
  appendFileSync(githubOutput, `version=${version}\n`);
}
