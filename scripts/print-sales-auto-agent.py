#!/usr/bin/env python3
"""
Print Sales Auto-Agent (v1) — abandoned checkout → Automated Edition Manager.

Ship-ugly: endpoint URL is hardcoded below (no env framework).
Posts to the Vercel Edition Manager API (uses Supabase credentials on the server).

Canonical path: scripts/print-sales-auto-agent.py
(Photographer Pack local bundle: Agent-C-Print-Drop/)
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

# --- hardcoded connection (Step 3) ---
EDITION_MANAGER_ENDPOINT = (
    "https://codex-system-architecture.vercel.app/api/edition-ingest"
)


def push_abandoned_checkout(
    *,
    customer_email: str,
    cart_total_cents: int,
    edition_title: str,
) -> dict:
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
    req = urllib.request.Request(
        EDITION_MANAGER_ENDPOINT,
        data=data,
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = resp.read().decode("utf-8")
        return json.loads(raw) if raw else {}


def main() -> int:
    try:
        result = push_abandoned_checkout(
            customer_email="test-buyer@example.com",
            cart_total_cents=29700,
            edition_title="Mountain Dawn — Limited Metal Print",
        )
    except urllib.error.HTTPError as exc:
        err_body = exc.read().decode("utf-8", errors="replace")
        print(f"HTTP {exc.code}: {err_body}", file=sys.stderr)
        return 1

    print("Edition Manager ingest OK:")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
