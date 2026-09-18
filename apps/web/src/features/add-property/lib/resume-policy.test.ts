import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  decideAddPropertyEntry,
  shouldAutoOpenWizardAfterSubmit,
} from './resume-policy';

describe('decideAddPropertyEntry', () => {
  it('creates when no drafts', () => {
    assert.deepEqual(decideAddPropertyEntry([]), { kind: 'create' });
  });

  it('ignores non-DRAFT statuses', () => {
    assert.deepEqual(
      decideAddPropertyEntry([
        {
          id: 'p1',
          title: 'Submitted',
          status: 'PENDING_REVIEW',
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
        {
          id: 'p2',
          title: 'Published',
          status: 'PUBLISHED',
          updatedAt: '2026-01-03T00:00:00.000Z',
        },
      ]),
      { kind: 'create' },
    );
  });

  it('resumes single DRAFT', () => {
    const draft = {
      id: 'd1',
      title: 'Incomplete',
      status: 'DRAFT',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    assert.deepEqual(decideAddPropertyEntry([draft]), {
      kind: 'resume_one',
      draft,
    });
  });

  it('lists multiple DRAFTs newest first', () => {
    const older = {
      id: 'd1',
      title: 'A',
      status: 'DRAFT',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    const newer = {
      id: 'd2',
      title: 'B',
      status: 'DRAFT',
      updatedAt: '2026-01-02T00:00:00.000Z',
    };
    const decision = decideAddPropertyEntry([older, newer]);
    assert.equal(decision.kind, 'choose');
    if (decision.kind === 'choose') {
      assert.deepEqual(
        decision.drafts.map((d) => d.id),
        ['d2', 'd1'],
      );
    }
  });

  it('does not resume submitted after mix', () => {
    const decision = decideAddPropertyEntry([
      {
        id: 'submitted',
        title: 'Done',
        status: 'PENDING_REVIEW',
        updatedAt: '2026-02-01T00:00:00.000Z',
      },
      {
        id: 'draft-a',
        title: 'Open',
        status: 'DRAFT',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'draft-b',
        title: 'Open 2',
        status: 'DRAFT',
        updatedAt: '2026-01-05T00:00:00.000Z',
      },
    ]);
    assert.equal(decision.kind, 'choose');
    if (decision.kind === 'choose') {
      assert.deepEqual(
        decision.drafts.map((d) => d.id),
        ['draft-b', 'draft-a'],
      );
      assert.ok(!decision.drafts.some((d) => d.id === 'submitted'));
    }
  });
});

describe('shouldAutoOpenWizardAfterSubmit', () => {
  it('blocks PENDING_REVIEW and PUBLISHED', () => {
    assert.equal(shouldAutoOpenWizardAfterSubmit('PENDING_REVIEW'), false);
    assert.equal(shouldAutoOpenWizardAfterSubmit('PUBLISHED'), false);
    assert.equal(shouldAutoOpenWizardAfterSubmit('REJECTED'), true);
    assert.equal(shouldAutoOpenWizardAfterSubmit('DRAFT'), true);
  });
});
