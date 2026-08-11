import { describe, expect, it } from 'vitest';

import { CORPUS_DOCUMENTS, corpusToDocuments } from './codexCorpus';
import { CODEX_DOCUMENT_BODIES, getCodexDocumentBody } from './codexDocumentBodies';

describe('codexDocumentBodies', () => {
  it('includes rich bodies for every corpus path', () => {
    for (const doc of CORPUS_DOCUMENTS) {
      expect(CODEX_DOCUMENT_BODIES[doc.path], doc.path).toBeTruthy();
      expect(getCodexDocumentBody(doc.path).length).toBeGreaterThan(doc.content.length);
    }
  });

  it('gives Personal OS an honest architecture page and evidence-labeled guides', () => {
    const personalOs = getCodexDocumentBody('/codex/personal_os');
    expect(personalOs).toMatch(/practical support layer/i);
    expect(personalOs).toMatch(/Evidence status/);

    const neuro = getCodexDocumentBody('/codex/personal_os/neurodivergent_os.md');
    expect(neuro).toMatch(/# Accessible Work System/);
    expect(neuro).toMatch(/accessibility/i);

    const identity = getCodexDocumentBody('/codex/root/identity.md');
    expect(identity).toMatch(/# Identity/);
    expect(identity).toMatch(/Edward Emory Photography/);
  });

  it('hydrates corpus documents with full markdown bodies', () => {
    const docs = corpusToDocuments();
    expect(docs).toHaveLength(CORPUS_DOCUMENTS.length);

    const personal = docs.find((doc) => doc.path === '/codex/personal_os');
    expect(personal?.content).toMatch(/Evidence status/);

    const leaf = docs.find((doc) => doc.path === '/codex/personal_os/personality_manual.md');
    expect(leaf?.content).toMatch(/Working With Eddie/i);
    expect(leaf?.parent_id).toBe(personal?.id);
  });
});
