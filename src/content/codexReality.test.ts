import { describe, expect, it } from 'vitest';
import { CORPUS_DOCUMENTS, corpusToDocuments } from './codexCorpus';
import { CODEX_DOCUMENT_BODIES } from './codexDocumentBodies';
import {
  CANONICAL_REVIEW_DATE,
  DOCUMENT_INTELLIGENCE,
  DOCUMENT_RELATIONSHIPS,
  getReviewCadenceDays,
} from './documentIntelligence';

const forbiddenClaims = [
  'Sony A7R IV',
  'Sony A7S III',
  'Sony 12-24 f/2.8 GM',
  'Sigma 14mm f/1.8',
  'RRS TVC-34L',
  'Sample Size: 63 deep work sessions',
  'Sessions: 145',
  'Jan: Revenue ████████ $14K',
  'CORRELATION: -0.67',
  'User satisfaction | >4/5 | 4.2/5',
  'Target Date: June 2026',
  'Feb 15-22 | Primary shooting window',
  '14-day photography expedition',
  'Automated order fulfillment',
  'Whoop sync reliability',
];

describe('Codex reality contract', () => {
  it('has one canonical body for every corpus path', () => {
    expect(Object.keys(CODEX_DOCUMENT_BODIES)).toHaveLength(CORPUS_DOCUMENTS.length);

    for (const document of CORPUS_DOCUMENTS) {
      expect(CODEX_DOCUMENT_BODIES[document.path], document.path).toBeTruthy();
    }
  });

  it('labels every document with evidence status and review date', () => {
    for (const document of corpusToDocuments()) {
      expect(document.content, document.path).toContain('**Evidence status:**');
      expect(document.content, document.path).toContain(
        `**Last reviewed:** ${CANONICAL_REVIEW_DATE}`,
      );
      expect(document.provenance_status.length, document.path).toBeGreaterThan(0);
      expect(document.evidence_basis.trim().length, document.path).toBeGreaterThan(0);
      expect(document.last_reviewed, document.path).toBe(CANONICAL_REVIEW_DATE);
      expect(document.is_read_only, document.path).toBe(true);
      for (const status of document.provenance_status) {
        expect(
          ['verified', 'repository_evidence', 'concept', 'unknown'],
          document.path,
        ).toContain(status);
      }
    }
  });

  it('gives every canonical document an outcome-producing operational brief', () => {
    expect(Object.keys(DOCUMENT_INTELLIGENCE).sort()).toEqual(
      CORPUS_DOCUMENTS.map((document) => document.path).sort(),
    );

    for (const document of corpusToDocuments()) {
      const intelligence = DOCUMENT_INTELLIGENCE[document.path];
      const wordCount = document.content.split(/\s+/).filter(Boolean).length;

      expect(intelligence.outcome.length, document.path).toBeGreaterThan(60);
      expect(intelligence.nextAction.length, document.path).toBeGreaterThan(50);
      expect(intelligence.proof.length, document.path).toBeGreaterThan(50);
      expect(document.content, document.path).toContain('## Outcome contract');
      expect(document.content, document.path).toContain('**Next move:**');
      expect(document.content, document.path).toContain('**Done when:**');
      expect(document.content, document.path).toContain('## Operating decisions');
      expect(document.content, document.path).toContain('## Evidence and refresh protocol');
      expect(document.content, document.path).toContain('## Connected systems');
      expect(wordCount, document.path).toBeGreaterThan(180);
    }
  });

  it('preserves explicit unknown claims inside otherwise verified documents', () => {
    const documents = corpusToDocuments();
    const gear = documents.find(
      (document) => document.path === '/codex/artistic_systems/photography_ops/gear_specs.md',
    );
    const identity = documents.find((document) => document.path === '/codex/root/identity.md');
    const personality = documents.find(
      (document) => document.path === '/codex/personal_os/personality_manual.md',
    );
    const dropModel = documents.find(
      (document) => document.path === '/codex/business/drop_model.md',
    );

    expect(gear?.provenance_status).toContain('verified');
    expect(gear?.provenance_status).toContain('unknown');
    expect(identity?.provenance_status).toContain('verified');
    expect(identity?.provenance_status).not.toContain('unknown');
    expect(personality?.provenance_status).toContain('verified');
    expect(personality?.provenance_status).not.toContain('unknown');
    expect(dropModel?.provenance_status).toContain('unknown');
  });

  it('uses category cadence when a document has no explicit override', () => {
    expect(getReviewCadenceDays('/codex/territory/version_schema.md')).toBe(30);
    expect(getReviewCadenceDays('/codex/artistic_systems/photography_ops/timelapse_ops.md')).toBe(60);
    expect(getReviewCadenceDays('/codex/root/identity.md')).toBe(90);
  });

  it('keeps every explicit relationship inside the canonical corpus', () => {
    const paths = new Set(CORPUS_DOCUMENTS.map((document) => document.path));
    const relationshipKeys = new Set<string>();

    for (const relationship of DOCUMENT_RELATIONSHIPS) {
      expect(paths.has(relationship.sourcePath), relationship.sourcePath).toBe(true);
      expect(paths.has(relationship.targetPath), relationship.targetPath).toBe(true);
      expect(relationship.rationale.length).toBeGreaterThan(40);
      const key = [relationship.sourcePath, relationship.targetPath].sort().join('::');
      expect(relationshipKeys.has(key), key).toBe(false);
      relationshipKeys.add(key);
    }
  });

  it('contains none of the known fabricated ownership, metric, or project claims', () => {
    const corpus = corpusToDocuments().map((document) => document.content).join('\n');

    for (const claim of forbiddenClaims) {
      expect(corpus, claim).not.toContain(claim);
    }
  });

  it('records the verified camera and lens inventory', () => {
    const gear = CODEX_DOCUMENT_BODIES['/codex/artistic_systems/photography_ops/gear_specs.md'];

    expect(gear).toContain('Sony A7 III');
    expect(gear).toContain('Sony RX10 IV');
    expect(gear).toContain('Sony 20mm f/1.8 G');
    expect(gear).toContain('Rokinon 14mm f/2.8');
    expect(gear).toContain('Sony 24–70mm f/4 Zeiss Vario-Tessar');
  });

  it('does not present private financial figures on the public site', () => {
    const money = CODEX_DOCUMENT_BODIES['/codex/business/money_os.md'];

    expect(money).toContain('Private financial figures are intentionally excluded');
  });
});
