# Skill: lint (Notion)

Report wiki health. **No mass edits** without approval.

## Checks

1. **Knowledge Base** — `Status` = `Needs Update` or `Next Review` on/before today (use Needs Update view if available)
2. **Draft backlog** — `Status` = `Draft` older than 14 days
3. **Empty Summary** on Published rows
4. **Wiki Compile Queue** — `Status` = Inbox older than 7 days
5. **Topics** — search workspace for concepts mentioned in 3+ KB entries without a Topic page (heuristic)
6. **Contradictions** — same entity, incompatible claims in two KB bodies (quote both)

## Output

Markdown report to human + append one line to Wiki Log:

`## [date] lint | N issues`

## Verification

- [ ] Report delivered
- [ ] Log appended
