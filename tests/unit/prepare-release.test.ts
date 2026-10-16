import { describe, it, expect } from 'vitest';
import { insertReleaseNotes } from '../../scripts/prepare-release.mjs';

describe('insertReleaseNotes', () => {
  it('returns bare notes when there is no existing changelog', () => {
    expect(insertReleaseNotes('## [1.0.0] notes', '')).toBe('## [1.0.0] notes\n');
    expect(insertReleaseNotes('## [1.0.0] notes', undefined as unknown as string)).toBe(
      '## [1.0.0] notes\n'
    );
  });

  it('appends after a header-only scaffold with no release headings yet', () => {
    const existing = '# Changelog\n\nAll notable changes to this project will be documented here.';
    const result = insertReleaseNotes('## [1.0.0](link) (2026-01-01)\n\n* first release', existing);
    expect(result).toBe(
      '# Changelog\n\nAll notable changes to this project will be documented here.\n\n' +
        '## [1.0.0](link) (2026-01-01)\n\n* first release\n'
    );
  });

  it('prepends notes when there is no header scaffold (heading at index 0)', () => {
    const existing = '## [1.0.0](link) (2026-01-01)\n\n* first release';
    const notes = '## [1.1.0](link) (2026-02-01)\n\n* second release';
    const result = insertReleaseNotes(notes, existing);
    expect(result).toBe(`${notes}\n\n${existing}\n`);
  });

  it('inserts notes between the header scaffold and the first versioned entry (node-rootly shape: no Unreleased section)', () => {
    const existing =
      '# Changelog\n\n' +
      'All notable changes to this project will be documented in this file.\n' +
      'See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.\n\n' +
      '## [1.0.3](https://github.com/WYRE-AI/node-rootly/compare/v1.0.2...v1.0.3) (2026-08-25)\n\n' +
      '* export request() from public API';
    const notes = '## [1.0.4](https://github.com/WYRE-AI/node-rootly/compare/v1.0.3...v1.0.4) (2026-10-16)\n\n* a new fix';
    const result = insertReleaseNotes(notes, existing);

    expect(result).toBe(
      '# Changelog\n\n' +
        'All notable changes to this project will be documented in this file.\n' +
        'See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.\n\n' +
        `${notes}\n\n` +
        '## [1.0.3](https://github.com/WYRE-AI/node-rootly/compare/v1.0.2...v1.0.3) (2026-08-25)\n\n' +
        '* export request() from public API\n'
    );
    // New notes must land strictly after the header, never swallow/duplicate it.
    expect(result.indexOf(notes)).toBeGreaterThan(result.indexOf('# Changelog'));
    expect(result.match(/# Changelog/g)).toHaveLength(1);
  });

  it('keeps "## [Unreleased]" above the inserted notes, not below it (the regression this PR fixes)', () => {
    const existing =
      '# Changelog\n\n' +
      'All notable changes to this project will be documented in this file.\n\n' +
      '## [Unreleased]\n\n' +
      '## [1.0.0](link) (2026-08-25)\n\n' +
      '* first release';
    const notes = '## [1.1.0](link) (2026-10-16)\n\n* a new fix';
    const result = insertReleaseNotes(notes, existing);

    const unreleasedIdx = result.indexOf('## [Unreleased]');
    const notesIdx = result.indexOf(notes);
    const oldEntryIdx = result.indexOf('## [1.0.0]');

    expect(unreleasedIdx).toBeGreaterThan(-1);
    // Unreleased must stay ABOVE the newly inserted notes (this is the exact
    // bug an unqualified /^## \[/ regex would reintroduce: matching
    // "## [Unreleased]" itself as "the first real entry" and inserting the
    // new notes between the preamble and Unreleased instead of below it).
    expect(unreleasedIdx).toBeLessThan(notesIdx);
    expect(notesIdx).toBeLessThan(oldEntryIdx);
  });

  it('recognizes the bare first-release heading shape ("# X.Y.Z (date)", no link) as a real entry', () => {
    const existing =
      '# Changelog\n\n' +
      'All notable changes to this project will be documented in this file.\n\n' +
      '# 1.0.0 (2026-01-01)\n\n' +
      '* initial release — no repository link configured';
    const notes = '## [1.1.0](link) (2026-02-01)\n\n* second release';
    const result = insertReleaseNotes(notes, existing);

    expect(result.indexOf('# Changelog')).toBeLessThan(result.indexOf(notes));
    expect(result.indexOf(notes)).toBeLessThan(result.indexOf('# 1.0.0 (2026-01-01)'));
  });
});
