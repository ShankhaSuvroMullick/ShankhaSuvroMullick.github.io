#!/usr/bin/env python3
"""
Fetches live stats from Codeforces, LeetCode, AtCoder.
Runs via GitHub Actions daily. No API keys needed.
LeetCode: if fetch fails, keeps existing data instead of overwriting with nulls.
"""

import json, urllib.request, urllib.error, time
from datetime import datetime, timezone
from pathlib import Path

OUT = Path(__file__).parent.parent / "public" / "data" / "competitive.json"

def fetch(url, headers=None, data=None):
    req = urllib.request.Request(url, data=data, headers=headers or {})
    req.add_header("User-Agent", "Mozilla/5.0 (compatible; portfolio-stats/1.0)")
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

def load_existing():
    try:
        return json.loads(OUT.read_text())
    except:
        return {}

def codeforces():
    handle = "Shankha_Suvro_Mullick"
    try:
        info = fetch(f"https://codeforces.com/api/user.info?handles={handle}")["result"][0]
        time.sleep(1)
        submissions = fetch(f"https://codeforces.com/api/user.status?handle={handle}&count=10000")["result"]
        solved = len(set(
            f"{s['problem']['contestId']}{s['problem']['index']}"
            for s in submissions if s.get("verdict") == "OK"
        ))
        contests_data = fetch(f"https://codeforces.com/api/user.rating?handle={handle}")
        contests = len(contests_data.get("result", []))
        return {
            "handle": handle,
            "url": f"https://codeforces.com/profile/{handle}",
            "rating": info.get("rating"),
            "maxRating": info.get("maxRating"),
            "title": info.get("maxRank", "").replace("_", " ").title() if info.get("maxRank") else None,
            "problemsSolved": solved,
            "contests": contests,
            "error": False,
        }
    except Exception as e:
        print(f"CF error: {e}")
        return None  # None = keep existing

def leetcode(existing):
    handle = "RMSM"
    try:
        payload = json.dumps({
            "query": "query($u:String!){matchedUser(username:$u){submitStatsGlobal{acSubmissionNum{difficulty count}}userContestRanking{rating attendedContestsCount}}}",
            "variables": {"u": handle}
        }).encode()
        req = urllib.request.Request(
            "https://leetcode.com/graphql",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://leetcode.com/",
                "Origin": "https://leetcode.com",
            }
        )
        data = json.loads(urllib.request.urlopen(req, timeout=15).read())
        user = data["data"]["matchedUser"]
        stats = {s["difficulty"]: s["count"] for s in user["submitStatsGlobal"]["acSubmissionNum"]}
        cr = user.get("userContestRanking") or {}
        r = round(cr.get("rating") or 0)
        def title(rt):
            if rt >= 2500: return "Guardian"
            if rt >= 2000: return "Knight"
            if rt >= 1500: return "Specialist"
            return "Coder" if rt > 0 else None
        return {
            "handle": handle, "url": f"https://leetcode.com/u/{handle}/",
            "rating": r or None, "maxRating": None, "title": title(r),
            "problemsSolved": stats.get("All", 0),
            "easy": stats.get("Easy", 0), "medium": stats.get("Medium", 0),
            "hard": stats.get("Hard", 0),
            "contests": cr.get("attendedContestsCount"), "error": False,
        }
    except Exception as e:
        print(f"LC error: {e} — keeping existing data")
        # Return existing data instead of nulls
        return existing.get("leetcode", {
            "handle": handle, "url": f"https://leetcode.com/u/{handle}/",
            "rating": None, "maxRating": None, "title": None,
            "problemsSolved": None, "easy": None, "medium": None,
            "hard": None, "contests": None, "error": True
        })

def atcoder():
    handle = "ShankhaSM"
    try:
        data = fetch(f"https://atcoder.jp/users/{handle}/history/json")
        if not data:
            return {"handle": handle, "url": f"https://atcoder.jp/users/{handle}",
                    "rating": 0, "maxRating": 0, "title": "Gray",
                    "problemsSolved": None, "contests": 0, "error": False}
        ratings = [c.get("NewRating", 0) for c in data]
        cur, mx = ratings[-1], max(ratings)
        def title(r):
            for t, mn in [("Red",2800),("Orange",2400),("Yellow",2000),("Blue",1600),("Cyan",1200),("Green",800),("Brown",400)]:
                if r >= mn: return t
            return "Gray"
        return {"handle": handle, "url": f"https://atcoder.jp/users/{handle}",
                "rating": cur, "maxRating": mx, "title": title(cur),
                "problemsSolved": None, "contests": len(data), "error": False}
    except Exception as e:
        print(f"AtCoder error: {e}")
        return None  # None = keep existing

# Load existing data to preserve manual entries
existing = load_existing()

print("Fetching Codeforces...")
cf = codeforces()
if cf is None:
    cf = existing.get("codeforces", {"handle": "Shankha_Suvro_Mullick", "url": "https://codeforces.com/profile/Shankha_Suvro_Mullick", "error": True})
print(f"  rating={cf.get('rating')}, solved={cf.get('problemsSolved')}, contests={cf.get('contests')}")

time.sleep(2)
print("Fetching LeetCode...")
lc = leetcode(existing)
print(f"  rating={lc.get('rating')}, solved={lc.get('problemsSolved')}, contests={lc.get('contests')}")

time.sleep(2)
print("Fetching AtCoder...")
at = atcoder()
if at is None:
    at = existing.get("atcoder", {"handle": "ShankhaSM", "url": "https://atcoder.jp/users/ShankhaSM", "error": True})
print(f"  rating={at.get('rating')}, contests={at.get('contests')}")

result = {
    "codeforces": cf,
    "leetcode": lc,
    "atcoder": at,
    "last_updated": datetime.now(timezone.utc).isoformat(),
}

OUT.write_text(json.dumps(result, indent=2))
print(f"\n✓ {OUT} updated")
