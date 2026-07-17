#!/usr/bin/env python3
import json, urllib.request
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA = ROOT / "public" / "data" / "projects.json"

with open(DATA) as f: data = json.load(f)
dead = []
for p in data["projects"]:
    for url in [p.get("repo"), p.get("demo")]:
        if not url: continue
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=8) as r:
                if r.status != 200: dead.append((p["name"], url, r.status))
        except Exception as e:
            dead.append((p["name"], url, str(e)))

if dead:
    print(f"✗ {len(dead)} dead links:")
    for name, url, reason in dead: print(f"  [{name}] {url} → {reason}")
    exit(1)
else:
    print(f"✓ All links healthy")
