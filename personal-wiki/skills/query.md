# Skill: query

Answer from the **wiki**, not by re-deriving everything from raw files. Raw is fallback only when the wiki is silent.

## Steps

1. **Read** `wiki/index.md` — list candidate pages.
2. **Open** the smallest set of pages that could answer the question.
3. **Synthesize** an answer with:
   - Short direct answer first
   - Evidence bullets citing `[[wiki pages]]`
   - “Gaps” section if the wiki is thin
4. **Optional file-back** — if the human agrees the answer is durable:
   - Create `wiki/synthesis/<slug>.md`
   - Log: `## [YYYY-MM-DD] query | <question slug>`
   - Update index

## Output formats (pick what fits)

| Question type | Format |
|---------------|--------|
| Factual | Markdown sections |
| Comparison | Table |
| Timeline | Dated list |
| Decision | Pros/cons + recommendation |

## Verification

- [ ] At least one `[[wiki link]]` cited, or explicit “wiki has no coverage yet”
- [ ] Offered to file synthesis if answer is non-obvious and reusable
- [ ] Did not modify raw sources
