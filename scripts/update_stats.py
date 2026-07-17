#!/usr/bin/env python3
import json, os, re, urllib.request
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA = ROOT / "public" / "data" / "projects.json"
TOKEN = os.environ.get("GITHUB_TOKEN", "")

def fetch_stars(repo_url):
    m = re.search(r'github\.com/([^/]+)/([^/]+)', repo_url)
    if not m: return None
    owner, repo = m.groups()
    repo = repo.rstrip("/")
    req = urllib.request.Request(f"https://api.github.com/repos/{owner}/{repo}")
    req.add_header("Accept", "application/vnd.github+json")
    if TOKEN: req.add_header("Authorization", f"Bearer {TOKEN}")
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read()).get("stargazers_count", 0)
    except: return None

with open(DATA) as f: data = json.load(f)
for p in data["projects"]:
    stars = fetch_stars(p.get("repo", ""))
    if stars is not None:
        p["stars"] = stars
        print(f"  ⭐ {p['name']}: {stars}")
with open(DATA, "w") as f: json.dump(data, f, indent=2)
print("Done")
