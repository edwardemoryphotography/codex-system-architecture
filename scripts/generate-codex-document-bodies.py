#!/usr/bin/env python3
"""Regenerate src/content/codexDocumentBodies.ts from rich-content SQL migrations."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS = ROOT / "supabase" / "migrations"
CORPUS_TS = ROOT / "src" / "content" / "codexCorpus.ts"
OUT_TS = ROOT / "src" / "content" / "codexDocumentBodies.ts"


def extract_rich_contents() -> dict[str, str]:
    contents: dict[str, str] = {}
    for path in sorted(MIGRATIONS.glob("*rich*.sql")):
        sql = path.read_text()
        parts = re.split(r"\nUPDATE codex_documents\s*\nSET content = ", sql)
        for part in parts[1:]:
            match = re.search(
                r"^'(.*)'\s*,\s*\nupdated_at = NOW\(\)\s*\nWHERE path = '([^']+)';",
                part,
                re.S,
            )
            if not match:
                raise SystemExit(f"Failed to parse rich content in {path.name}")
            contents[match.group(2)] = match.group(1).replace("''", "'")
    return contents


def parse_corpus_docs() -> list[dict]:
    text = CORPUS_TS.read_text()
    pattern = re.compile(
        r"\{\s*title:\s*'((?:\\'|[^'])*)'\s*,\s*path:\s*'([^']+)'\s*,\s*content:\s*'((?:\\'|[^'])*)'\s*,\s*category:\s*'([^']+)'\s*,\s*parentPath:\s*(null|'[^']+')\s*,\s*order:\s*(\d+)\s*\}",
        re.S,
    )
    docs = []
    for match in pattern.finditer(text):
        title, path, stub, category, parent, order = match.groups()
        docs.append(
            {
                "title": title.replace("\\'", "'"),
                "path": path,
                "stub": stub.replace("\\'", "'"),
                "category": category,
                "parentPath": None if parent == "null" else parent.strip("'"),
                "order": int(order),
            }
        )
    if len(docs) < 50:
        raise SystemExit(f"Expected full corpus metadata, found {len(docs)}")
    return docs


def folder_markdown(doc: dict, children_map: dict[str | None, list[dict]], bodies: dict[str, str]) -> str:
    kids = children_map.get(doc["path"], [])
    lines = [
        f"# {doc['title']}",
        "",
        doc["stub"].rstrip(".") + ".",
        "",
        "## Architecture",
        "",
        f'This node is a **territory hub** in the Codex knowledge system. It organizes related documents under `{doc["path"]}` and connects them into the broader graph.',
        "",
        "### Structure",
        "",
    ]
    if not kids:
        lines.append("_No child documents yet._")
    else:
        lines.extend(
            [
                "| Order | Document | Path |",
                "| ---: | --- | --- |",
            ]
        )
        for child in kids:
            kind = "Folder" if children_map.get(child["path"]) else "File"
            lines.append(
                f"| {child['order']} | **{child['title']}** ({kind}) | `{child['path']}` |"
            )
        lines.extend(["", "### Contents", ""])
        for child in kids:
            summary = bodies.get(child["path"], child["stub"])
            summary_line = child["stub"]
            for line in summary.splitlines():
                stripped = line.strip()
                if (
                    stripped
                    and not stripped.startswith("#")
                    and not stripped.startswith("```")
                    and not stripped.startswith("|")
                    and not stripped.startswith("-")
                    and not stripped.startswith(">")
                ):
                    summary_line = stripped
                    break
            lines.append(f"- **{child['title']}** — {summary_line}")

    lines.extend(
        [
            "",
            "### How to use this territory",
            "",
            "1. Open a child document from the sidebar or knowledge graph.",
            "2. Follow cross-links and bridges into adjacent territories.",
            "3. Treat this hub as the map; the leaf files are the operating manuals.",
            "",
            f"> Category: `{doc['category']}` · Hub path: `{doc['path']}`",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    rich = extract_rich_contents()
    docs = parse_corpus_docs()
    children_map: dict[str | None, list[dict]] = {}
    for doc in docs:
        children_map.setdefault(doc["parentPath"], []).append(doc)
    for key in children_map:
        children_map[key].sort(key=lambda item: item["order"])

    bodies: dict[str, str] = {}
    for doc in docs:
        if doc["path"] in rich:
            bodies[doc["path"]] = rich[doc["path"]]
        elif children_map.get(doc["path"]):
            bodies[doc["path"]] = folder_markdown(doc, children_map, rich)
        else:
            bodies[doc["path"]] = (
                f"# {doc['title']}\n\n"
                f"{doc['stub']}.\n\n"
                f"## Overview\n\n"
                f"This document is part of the **{doc['category'].replace('_', ' ')}** territory in the Codex architecture.\n\n"
                f"Path: `{doc['path']}`\n"
            )

    payload = json.dumps(bodies, ensure_ascii=False, indent=2)
    OUT_TS.write_text(
        "/** Auto-generated from supabase rich-content migrations + folder architecture pages. */\n"
        "export const CODEX_DOCUMENT_BODIES: Record<string, string> = "
        f"{payload} as const;\n\n"
        "export function getCodexDocumentBody(path: string, fallback = \"\"): string {\n"
        "  return CODEX_DOCUMENT_BODIES[path] ?? fallback;\n"
        "}\n"
    )
    print(f"Wrote {OUT_TS.relative_to(ROOT)} with {len(bodies)} documents")


if __name__ == "__main__":
    main()
