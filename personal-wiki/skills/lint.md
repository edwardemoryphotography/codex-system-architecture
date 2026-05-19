# Skill: lint

Health-check the wiki. **Report first**; fix only what the human approves.

## Checks

1. **Index coverage** — every `wiki/**/*.md` (except index/log) appears in `wiki/index.md`
2. **Orphans** — pages with zero inbound `[[links]]` from other wiki pages
3. **Stubs** — `status: stub` older than 30 days without `updated` bump
4. **Contradictions** — same claim, incompatible statements (quote both pages)
5. **Stale** — `status: stale` but still linked as if current
6. **Concept gaps** — terms appearing in 3+ pages without a `wiki/concepts/` page
7. **Raw backlog** — files sitting in `raw/inbox/` older than 7 days

## Output

Markdown report:

```markdown
# Wiki lint — YYYY-MM-DD

## Critical
- ...

## Suggested ingests / new pages
- ...

## Optional cleanups
- ...
```

Append to log: `## [YYYY-MM-DD] lint | summary one-liner`

## Verification

- [ ] Report delivered to human
- [ ] Log appended if any issue found
- [ ] No mass deletes without explicit approval
