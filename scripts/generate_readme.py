#!/usr/bin/env python3
"""Regenerates docs/INDEX.md from projects.json for the markdown repo."""
import json
from pathlib import Path
from datetime import date

ROOT = Path(__file__).parent.parent
DATA = ROOT / "public" / "data" / "projects.json"

with open(DATA) as f: data = json.load(f)
projects = data["projects"]

lines = [
    f"# Shankha Suvro Mullick — Engineering Index",
    f"",
    f"> {len(projects)} projects · Updated {date.today()}",
    f"",
    f"| Project | Domain | Stack | Difficulty | Status | Benchmark |",
    f"|---------|--------|-------|-----------|--------|-----------|",
]
for p in sorted(projects, key=lambda x: x.get("last_updated",""), reverse=True):
    stack = ", ".join(p.get("languages",[])[:3])
    lines.append(f"| [{p['name']}]({p['repo']}) | {p.get('subcategory','—')} | {stack} | {p['difficulty']} | {p['status']} | {p.get('benchmark','—')} |")

out = ROOT / "docs" / "INDEX.md"
out.parent.mkdir(exist_ok=True)
out.write_text("\n".join(lines))
print(f"✓ {out} updated — {len(projects)} projects")
