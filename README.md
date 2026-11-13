# Prottay Kumar Adhikary
🎓 PhD, Computer Technology<br>
📍IIT Delhi, Haus Khas, India-110016<br>
📩 https://proadhikary.github.io<br>

## Lab (tools & games)

`tools.html` lists browser-only micro-tools and games. Everything runs client-side, so it works on GitHub Pages.

To add one:
1. Copy an existing folder, e.g. `tools/word-count/` → `tools/my-tool/` (it uses `tools/_shared/tool.css` + `tool.js` for the header, drop zones and downloads).
2. Add an entry to `tools/registry.js`. The Lab page renders its cards from that list.

## Google Scholar metrics

`data/scholar.json` holds citation metrics and papers from Google Scholar. The Publications page (`assets/js/publications.js`) uses it for a carousel of the 3 most cited papers, Citations / h-index / i10-index, a "Cited by N" link on each paper, and any Scholar paper not yet written into `publications.html`.

`.github/workflows/scholar.yml` refreshes it with `scripts/fetch_scholar.py`. It runs every 6 hours but only fetches when the data is over 7 days old; if Scholar blocks a run, the old data stays and the next run tries again. Run it by hand from the Actions tab ("Run workflow", tick *force*), or locally with `python3 scripts/fetch_scholar.py --force`.
