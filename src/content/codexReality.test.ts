import { describe, expect, it } from 'vitest';
import { CORPUS_DOCUMENTS, corpusToDocuments } from './codexCorpus';
import { CODEX_DOCUMENT_BODIES } from './codexDocumentBodies';

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
      expect(document.content, document.path).toContain('**Last reviewed:** 2026-07-14');
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
