# Skill: route

Map the user’s message to exactly one workflow. Load that skill’s full file before acting.

## Router table

| User intent (examples) | Load skill |
|------------------------|------------|
| “Ingest …”, “Process inbox”, “I added a file to raw” | [`ingest.md`](./ingest.md) |
| “What do I know about …”, “Summarize my notes on …”, “Compare A and B” | [`query.md`](./query.md) |
| “Lint”, “Health check”, “Find contradictions”, “Orphan pages” | [`lint.md`](./lint.md) |
| “Read book”, “Chapter 3”, fiction / reading log | *Add* `read-book.md` when you need it |
| “Weekly review”, “Goals check-in” | *Add* `weekly-review.md` when you need it |

## If ambiguous

Ask one clarifying question:

- Are we **adding** knowledge (ingest), **retrieving** it (query), or **maintaining** structure (lint)?

## If multiple intents

Run in order: ingest first (if new raw material exists), then query, then lint only if requested.

## Verification

- [ ] Correct skill file loaded
- [ ] User told which skill you are following
