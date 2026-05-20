#!/usr/bin/env node
/**
 * Package smoke test.
 *
 * Unit and integration tests run against `src/` through TypeScript — they
 * never load `dist/` or resolve the package.json `exports` map. A broken
 * exports map (see issue #2: a phantom `dist/index.mjs`) therefore passes
 * every other check and only fails for real consumers.
 *
 * This test packs the tarball exactly as `npm publish` would, installs it
 * into a throwaway directory, and loads it by package name via both
 * `import` and `require`. If either entry point or a known export is
 * missing, it exits non-zero.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = '@wyre-technology/node-superops';
const EXPECTED_EXPORT = 'SuperOpsClient';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workDir = mkdtempSync(join(tmpdir(), 'superops-smoke-'));

/** Run a command, surfacing stdout/stderr on failure. */
function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: 'pipe', ...opts });
}

try {
  console.log('• Packing tarball…');
  const packed = JSON.parse(
    run('npm', ['pack', '--json', '--pack-destination', workDir], { cwd: root }),
  );
  const tarball = join(workDir, packed[0].filename);

  console.log('• Installing tarball into a clean directory…');
  writeFileSync(
    join(workDir, 'package.json'),
    JSON.stringify({ name: 'smoke-consumer', private: true, version: '0.0.0' }),
  );
  run('npm', ['install', '--no-save', '--silent', tarball], { cwd: workDir });

  console.log(`• Resolving "${PKG}" via import (ESM)…`);
  run(
    'node',
    [
      '--input-type=module',
      '-e',
      `import('${PKG}').then((m) => {
         if (typeof m.${EXPECTED_EXPORT} !== 'function') {
           throw new Error('ESM entry missing export ${EXPECTED_EXPORT}');
         }
       });`,
    ],
    { cwd: workDir },
  );

  console.log(`• Resolving "${PKG}" via require (CJS)…`);
  run(
    'node',
    [
      '--input-type=commonjs',
      '-e',
      `const m = require('${PKG}');
       if (typeof m.${EXPECTED_EXPORT} !== 'function') {
         throw new Error('CJS entry missing export ${EXPECTED_EXPORT}');
       }`,
    ],
    { cwd: workDir },
  );

  console.log('\n✓ Smoke test passed — package resolves via import and require.');
} catch (err) {
  console.error('\n✗ Smoke test failed.\n');
  if (err.stdout) console.error(err.stdout);
  if (err.stderr) console.error(err.stderr);
  else console.error(err.message);
  process.exitCode = 1;
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
