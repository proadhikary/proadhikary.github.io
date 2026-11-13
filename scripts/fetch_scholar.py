#!/usr/bin/env python3
"""Fetch Google Scholar metrics + publications into data/scholar.json.

Run by .github/workflows/scholar.yml. Scholar has no API and sometimes blocks
GitHub's servers, so this script is "try once, queue on failure":

  * If the saved data is fresh (younger than REFRESH_DAYS) it does nothing.
  * Otherwise it tries to fetch. On success it rewrites the JSON.
  * On failure it leaves the old JSON untouched and exits 0; the workflow runs
    again every few hours, so the refresh stays queued until one attempt works.

Pass --force to ignore the freshness check. Standard library only.
"""
import html
import json
import os
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone

USER = "zjaqexkAAAAJ"
REFRESH_DAYS = 7
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "scholar.json")
URL = f"https://scholar.google.com/citations?user={USER}&hl=en&cstart=0&pagesize=100"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def load_existing():
    try:
        with open(OUT, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def is_fresh(data):
    try:
        fetched = datetime.fromisoformat(data["fetched"])
    except (TypeError, KeyError, ValueError):
        return False
    return (datetime.now(timezone.utc) - fetched).days < REFRESH_DAYS


def text(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def fetch():
    req = urllib.request.Request(URL, headers={"User-Agent": UA, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def parse(page):
    stats = [int(x) for x in re.findall(r'class="gsc_rsb_std">(\d+)<', page)]
    if len(stats) < 6:
        raise ValueError("metrics table not found (probably a CAPTCHA page)")

    pubs = []
    for row in re.findall(r'<tr class="gsc_a_tr">(.*?)</tr>', page, re.S):
        title = re.search(r'class="gsc_a_at">(.*?)</a>', row, re.S)
        if not title:
            continue
        link = re.search(r'href="(/citations\?view_op=view_citation[^"]+)"', row)
        gray = re.findall(r'<div class="gs_gray">(.*?)</div>', row, re.S)
        venue = re.sub(r'<span class="gs_oph">.*?</span>', "", gray[1]) if len(gray) > 1 else ""
        cites = re.search(r'class="gsc_a_ac gs_ibl">(\d*)<', row)
        cites_link = re.search(r'href="(https://scholar\.google\.com/scholar\?[^"]*cites=[^"]+)"', row)
        year = re.search(r'class="gsc_a_h gsc_a_hc gs_ibl">(\d{4})<', row)
        pubs.append({
            "title": text(title.group(1)),
            "authors": text(gray[0]) if gray else "",
            "venue": text(venue),
            "year": int(year.group(1)) if year else None,
            "citations": int(cites.group(1)) if cites and cites.group(1) else 0,
            "url": "https://scholar.google.com" + html.unescape(link.group(1)) if link else None,
            "citations_url": html.unescape(cites_link.group(1)) if cites_link else None,
        })
    if not pubs:
        raise ValueError("no publications found")

    # Citations per year: the bar chart's labels and bars line up by their CSS "right" offset.
    labels = {int(r): int(y) for r, y in re.findall(r'class="gsc_g_t" style="right:(\d+)px">(\d{4})<', page)}
    per_year = {y: 0 for y in labels.values()}
    for r, n in re.findall(r'class="gsc_g_a" style="right:(\d+)px[^"]*"><span class="gsc_g_al">(\d+)<', page):
        year = labels.get(int(r) - 5)
        if year:
            per_year[year] = int(n)

    return {
        "fetched": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "profile": f"https://scholar.google.com/citations?user={USER}&hl=en",
        "metrics": {
            "citations": {"all": stats[0], "recent": stats[1]},
            "h_index": {"all": stats[2], "recent": stats[3]},
            "i10_index": {"all": stats[4], "recent": stats[5]},
        },
        "citations_per_year": [{"year": y, "citations": per_year[y]} for y in sorted(per_year)],
        "publications": pubs,
    }


def main():
    existing = load_existing()
    if "--force" not in sys.argv and existing and is_fresh(existing):
        print(f"Data is fresh (fetched {existing['fetched']}); nothing to do.")
        return 0

    for attempt in range(1, 4):
        try:
            data = parse(fetch())
            break
        except Exception as e:  # network error, HTTP 429, CAPTCHA page...
            print(f"Attempt {attempt} failed: {e}")
            time.sleep(20 * attempt)
    else:
        print("::warning::Scholar fetch failed; keeping old data, will retry on the next scheduled run.")
        return 0

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")
    m = data["metrics"]
    print(f"Saved {len(data['publications'])} papers; citations {m['citations']['all']}, "
          f"h-index {m['h_index']['all']}, i10 {m['i10_index']['all']}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
