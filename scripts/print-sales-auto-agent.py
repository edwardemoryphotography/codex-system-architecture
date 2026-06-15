#!/usr/bin/env python3
"""
Print Sales Auto-Agent (v1) — abandoned checkout → Automated Edition Manager.

Ship-ugly: endpoints hardcoded below (no env framework).
Tries production Vercel API first, then local Edition Manager on this machine.

Canonical path: scripts/print-sales-auto-agent.py
(Photographer Pack local bundle: Agent-C-Print-Drop/)
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

# --- hardcoded connection (Step 3) ---
EDITION_MANAGER_ENDPOINTS = (
    "https://codex-system-architecture.vercel.app/api/edition-ingest",
    "http://127.0.0.1:3999/ingest",
)


def push_abandoned_checkout(
    *,
    customer_email: str,
    cart_total_cents: int,
    edition_title: str,
) -> tuple[str, dict]:
    body = {
        "event_type": "abandoned_checkout",
        "customer_email": customer_email,
        "cart_total_cents": cart_total_cents,
        "edition_title": edition_title,
        "payload": {
            "channel": "manual_test",
            "recovery_email_draft": True,
        },
        "source": "print-sales-auto-agent",
    }
    data = json.dumps(body).encode("utf-8")
    last_error: urllib.error.HTTPError | None = None

    for endpoint in EDITION_MANAGER_ENDPOINTS:
        req = urllib.request.Request(
            endpoint,
            data=data,
            method="POST",
            headers={"Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                raw = resp.read().decode("utf-8")
                return endpoint, json.loads(raw) if raw else {}
        except urllib.error.HTTPError as exc:
            last_error = exc
            if exc.code in (503, 502, 504):
                continue
            raise

    if last_error is not None:
        raise last_error
    raise RuntimeError("No Edition Manager endpoints responded")


def main() -> int:
    try:
        used, result = push_abandoned_checkout(
            customer_email="test-buyer@example.com",
            cart_total_cents=29700,
            edition_title="Mountain Dawn — Limited Metal Print",
        )
    except urllib.error.HTTPError as exc:
        err_body = exc.read().decode("utf-8", errors="replace")
        print(f"HTTP {exc.code}: {err_body}", file=sys.stderr)
        print(
            "Tip: start local Edition Manager: node scripts/edition-manager-local.mjs",
            file=sys.stderr,
        )
        return 1

    print(f"Edition Manager ingest OK via {used}:")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
