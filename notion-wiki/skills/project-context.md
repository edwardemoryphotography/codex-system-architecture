# Skill: project context (Notion)

Ground the agent in **one active project** before ingest, query, or shipping work.

See `docs/CORPUS-POLICY.md`. Projects DB schema: `projects` in `config/notion.workspace.json`.

## When to use

- User names a project (“codex”, “legacy-codex”, “photography”)
- User says “what’s the state of…”, “work on…”, “ship…”
- Before coding agent touches a repo — load Notion context first

## Steps

1. **Resolve project** — search workspace for name; match row in **Projects** (`Status` not Done unless asked).
2. **Fetch project page** — read body, embedded notes, links (GitHub, StackBlitz, Figma).
3. **Roll up relations** (open linked pages):
   - **Tasks** — open incomplete tasks; note due dates
   - **Notes** — recent linked notes
   - **Resources** — linked references
   - **Areas** / **GOALS** — strategic fit
   - **Progress** rollup — % from tasks
4. **Codex overlap** — search for project name in Brain Dump Map, Command Center, Intake DB.
5. **KB synthesis** — optional: any 🧠 Knowledge Base row tagged for this project.
6. **External** — if body links GitHub repo, state: *“Code lives in X; Notion is planning layer.”*

## Output (Project context brief)

```markdown
# Project context: <Name>

- **Notion:** <project page URL>
- **Status / Priority / Progress:** …
- **Goal this week:** (infer from tasks + page, or say unknown)
- **Open tasks:** (bullets with links)
- **Linked notes & resources:** …
- **Codex / doctrine touchpoints:** …
- **Repo / external:** …
- **Gaps:** what’s missing in Notion for agents to ship
```

## After the brief

- **Query** → run `query.md` scoped to this project name
- **Ingest** → enrich **this** project page + related notes, not only KB
- **Ship** → user may hand brief to Cursor with repo path

## Verification

- [ ] Project page URL in output
- [ ] At least Tasks relation checked (or explicit “no tasks linked”)
- [ ] Did not treat KB database as full project knowledge
