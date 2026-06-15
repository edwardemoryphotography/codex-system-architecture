# Raw sources

**Immutable.** Agents read; they do not edit content here.

## Workflow

1. Drop files in **`inbox/`** (clips, exports, voice transcripts, PDFs if your toolchain supports them).
2. Run **ingest** skill — agent summarizes into `wiki/` and moves the file to **`sources/`**.
3. Keep originals forever — they are your evidence.

## Suggested `sources/` layout

```
raw/sources/
  2026/
    project-alpha/
      article-slug/
        original.md
```

Adjust in `CLAUDE.md` when you settle on a convention.
