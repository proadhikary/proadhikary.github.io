/* PUBLICATIONS page enhancements
 *
 * Top of the page, in order:
 *   1. carousel of the 3 most cited papers   (needs data/scholar.json)
 *   2. Google Scholar metric boxes           (needs data/scholar.json)
 *   3. filter bar: search, year, type, first-author, sort
 * then the publication list itself.
 *
 * data/scholar.json is refreshed by .github/workflows/scholar.yml. Scholar data
 * also adds "Cited by N" to each paper and any Scholar paper missing from the
 * hand-written list. Without the file, the filters still work on the list.
 */
(function () {
	const content = document.getElementById("publicationsContent");
	if (!content) return;
	const container = content.querySelector(".container") || content;

	/* ---------- helpers ---------- */
	const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
		({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
	const words = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, " ")
		.replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter((w) => w.length > 2);

	// Share of the shorter title's words found in the longer one.
	function similarity(a, b) {
		const A = new Set(words(a)), B = new Set(words(b));
		if (!A.size || !B.size) return 0;
		let hit = 0;
		A.forEach((w) => { if (B.has(w)) hit++; });
		return hit / Math.min(A.size, B.size);
	}

	const yearRows = () => Array.from(container.querySelectorAll(":scope > .row"))
		.filter((r) => r.querySelector(":scope > .pub-year-h2") && r.id !== "pubFlat");

	function titleOf(block) {
		const h = block.querySelector(".lucida-console");
		if (!h) return "";
		const clone = h.cloneNode(true);
		clone.querySelectorAll(".badge").forEach((b) => b.remove());
		return clone.textContent.replace(/\s+/g, " ").trim();
	}

	function badgeOf(block) {
		const b = block.querySelector(".badge");
		return b ? b.textContent.trim() : "";
	}

	function typeOf(badge, venue) {
		if (/journal|jbhi|ijmr/i.test(badge)) return "Journal";
		if (/conference|workshop|www'|acl|emnlp|naacl|coling/i.test(badge)) return "Conference";
		if (/preprint/i.test(badge)) return "Preprint";
		if (/dataset/i.test(badge)) return "Dataset";
		if (/arxiv|medrxiv|biorxiv/i.test(venue)) return "Preprint";
		if (/zenodo|dataset/i.test(venue)) return "Dataset";
		if (/journal|s[aā]dhan[aā]|procedia|transactions|research/i.test(venue)) return "Journal";
		if (/conference|proceedings|workshop|symposium|international/i.test(venue)) return "Conference";
		return "Other";
	}

	const linksRow = (block) => block.querySelector(".mt-1:not(.pub-authors)");

	/* ---------- Scholar: cited-by, missing papers, carousel, metrics ---------- */
	function citedBy(p) {
		if (!p.citations) return null;
		const span = document.createElement("span");
		span.className = "pub-force-margin-left scholar-cited";
		span.innerHTML = `<i class="fa-solid fa-chart-line"></i> <a href="${esc(p.citations_url || p.url || "#")}" target="_blank" class="link-dark">Cited by ${p.citations}</a>`;
		return span;
	}

	function newBlock(p) {
		const div = document.createElement("div");
		div.className = "pub-block";
		const type = typeOf("", p.venue);
		div.innerHTML =
			`<div class="lucida-console h5"><span class="badge rounded-pill text-bg-secondary">${esc(type)}</span> ${esc(p.title)}</div>
			<div class="pub-authors mt-1">${esc(p.authors).replace(/\bPK Adhikary\b/, '<span class="pub-author">PK Adhikary</span>')}</div>
			<div class="pub-congress">${esc(p.venue)}${p.venue && p.year ? " | " : ""}${p.year || ""}</div>
			<div class="mt-1">
				<i class="fa-solid fa-graduation-cap"></i> <a href="${esc(p.url || "#")}" target="_blank" class="link-dark">Google Scholar</a>
			</div><br>`;
		const c = citedBy(p);
		if (c) linksRow(div).appendChild(c);
		return div;
	}

	function yearRow(year) {
		const make = () => {
			const row = document.createElement("div");
			row.className = "row mt-2";
			row.innerHTML = `<h2 class="pub-year-h2">${year}</h2>`;
			return row;
		};
		for (const r of yearRows()) {
			const y = parseInt(r.querySelector(".pub-year-h2").textContent, 10);
			if (y === year) return r;
			if (y < year) { const row = make(); container.insertBefore(row, r); return row; }
		}
		const row = make();
		container.appendChild(row);
		return row;
	}

	function mergeScholar(data) {
		const blocks = Array.from(content.querySelectorAll(".pub-block"));
		const used = new Map(); // scholar index -> block
		const pageTitles = [];
		blocks.forEach((block) => {
			const t = titleOf(block);
			const venue = (block.querySelector(".pub-congress") || {}).textContent || "";
			pageTitles.push(t);
			let best = null, score = 0;
			data.publications.forEach((p, i) => {
				if (used.has(i)) return;
				const s = similarity(t, p.title);
				if (s < 0.8) return;
				// Same title twice on Scholar (e.g. workshop + journal): prefer the matching venue.
				const total = s + 0.1 * similarity(venue, p.venue);
				if (total > score) { score = total; best = i; }
			});
			if (best === null) return;
			used.set(best, block);
			const p = data.publications[best];
			block.dataset.citations = p.citations;
			const c = citedBy(p);
			if (c && linksRow(block)) linksRow(block).appendChild(c);
		});

		data.publications.forEach((p, i) => {
			if (used.has(i) || !p.year) return;
			// Another version of a paper already listed: show it once only.
			if (pageTitles.some((t) => similarity(t, p.title) >= 0.8)) return;
			const block = newBlock(p);
			block.dataset.citations = p.citations;
			yearRow(p.year).appendChild(block);
			used.set(i, block);
		});
		return used;
	}

	function carousel(data, blockFor) {
		const top = data.publications
			.map((p, i) => ({ p, block: blockFor.get(i) }))
			.filter((x) => x.p.citations > 0)
			.sort((a, b) => b.p.citations - a.p.citations)
			.slice(0, 3);
		if (!top.length) return null;

		const slide = ({ p, block }, n) => {
			const badge = block ? badgeOf(block) : "";
			const title = block ? titleOf(block) : p.title;
			const authors = block && block.querySelector(".pub-authors") ? block.querySelector(".pub-authors").innerHTML : esc(p.authors);
			const venue = block && block.querySelector(".pub-congress") ? block.querySelector(".pub-congress").textContent.trim() : `${p.venue} | ${p.year}`;
			const pdf = block && block.querySelector('a[href]:not([href="#"])');
			const read = pdf ? pdf.href : p.url;
			if (block && !block.id) block.id = "pub-top-" + n;
			return `<div class="carousel-item${n === 0 ? " active" : ""}">
				<div class="top-cited-card">
					<div class="top-cited-count">
						<div class="top-cited-num">${p.citations}</div>
						<div class="top-cited-num-label">citations</div>
					</div>
					<div class="top-cited-body">
						<div class="top-cited-rank">#${n + 1} most cited</div>
						<div class="lucida-console h5 mb-1">${badge ? `<span class="badge rounded-pill text-bg-secondary">${esc(badge)}</span> ` : ""}${esc(title)}</div>
						<div class="pub-authors">${authors}</div>
						<div class="pub-congress">${esc(venue)}</div>
						<div class="mt-2">
							<i class="far fa-file-pdf"></i> <a href="${esc(read || "#")}" target="_blank" class="link-dark">Read</a>
							${block ? `<span class="pub-force-margin-left"><i class="fa-solid fa-arrow-down"></i> <a href="#${block.id}" class="link-dark top-cited-jump">Show in list</a></span>` : ""}
						</div>
					</div>
				</div>
			</div>`;
		};

		const wrap = document.createElement("div");
		wrap.className = "row mt-2 mb-3";
		wrap.innerHTML = `<div class="col-12">
			<div id="topCited" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="7000">
				<div class="carousel-indicators">
					${top.map((_, n) => `<button type="button" data-bs-target="#topCited" data-bs-slide-to="${n}" ${n === 0 ? 'class="active" aria-current="true"' : ""} aria-label="Paper ${n + 1}"></button>`).join("")}
				</div>
				<div class="carousel-inner">${top.map(slide).join("")}</div>
				<button class="carousel-control-prev" type="button" data-bs-target="#topCited" data-bs-slide="prev">
					<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>
				</button>
				<button class="carousel-control-next" type="button" data-bs-target="#topCited" data-bs-slide="next">
					<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>
				</button>
			</div>
		</div>`;

		wrap.addEventListener("click", (e) => {
			const a = e.target.closest(".top-cited-jump");
			if (!a) return;
			e.preventDefault();
			resetFilters();
			const target = document.getElementById(a.getAttribute("href").slice(1));
			if (!target) return;
			target.scrollIntoView({ behavior: "smooth", block: "center" });
			target.classList.remove("pub-flash");
			void target.offsetWidth;
			target.classList.add("pub-flash");
		});
		return wrap;
	}

	function metricsRow(data) {
		const m = data.metrics;
		const fetched = new Date(data.fetched);
		const date = fetched.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
		const since = fetched.getFullYear() - 5; // Scholar's "recent" window
		const box = (label, val, sub) =>
			`<div class="col-6 col-lg-3 mb-3"><div class="scholar-metric">
				<div class="scholar-metric-value">${esc(val)}</div>
				<div class="scholar-metric-label">${label}</div>
				<div class="scholar-metric-sub">${sub}</div>
			</div></div>`;
		const pubs = data.publications || [];
		const best = pubs.reduce((a, p) => (p.citations > (a ? a.citations : -1) ? p : a), null);

		const div = document.createElement("div");
		div.className = "row mb-2 scholar-metrics";
		div.innerHTML =
			box("Citations", m.citations.all, `${m.citations.recent} since ${since}`) +
			box("h-index", m.h_index.all, `${m.h_index.recent} since ${since}`) +
			box("i10-index", m.i10_index.all, `${m.i10_index.recent} since ${since}`) +
			box("Papers", pubs.length, best ? `top paper: ${best.citations} cites` : "on Google Scholar") +
			`<div class="col-12 scholar-source">
				<i class="fa-solid fa-graduation-cap"></i>
				From <a href="${esc(data.profile)}" target="_blank" class="link-dark">Google Scholar</a>, updated ${esc(date)}
			</div>`;
		return div;
	}

	/* ---------- filters ---------- */
	let items = [];          // { block, row, year, type, first, text, cites, order }
	let rowOrder = [];
	const state = { q: "", year: "", type: "", first: false, sort: "new" };
	let ui = null;

	function collect() {
		items = [];
		rowOrder = yearRows();
		rowOrder.forEach((row) => {
			const year = parseInt(row.querySelector(".pub-year-h2").textContent, 10);
			row.querySelectorAll(":scope > .pub-block").forEach((block) => {
				// Every block ends with <br> so spacing stays even when reordered.
				if (block.lastElementChild && block.lastElementChild.tagName !== "BR") block.appendChild(document.createElement("br"));
				const venue = (block.querySelector(".pub-congress") || {}).textContent || "";
				const authors = block.querySelector(".pub-authors");
				items.push({
					block, row, year,
					type: typeOf(badgeOf(block), venue),
					first: !!authors && /^\s*<span class="pub-author"/.test(authors.innerHTML),
					text: (titleOf(block) + " " + (authors ? authors.textContent : "") + " " + venue + " " + badgeOf(block)).toLowerCase(),
					cites: +block.dataset.citations || 0,
					order: items.length
				});
			});
		});
	}

	function filterBar(hasCites) {
		const years = Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b - a);
		const types = ["Journal", "Conference", "Preprint", "Dataset", "Other"]
			.map((t) => [t, items.filter((i) => i.type === t).length]).filter(([, n]) => n);
		const wrap = document.createElement("div");
		wrap.className = "row mb-3";
		wrap.innerHTML = `<div class="col-12"><div class="pub-filters">
			<div class="pub-filter-row">
				<input type="search" class="form-control form-control-sm pub-search" placeholder="Search title, author, venue" aria-label="Search publications">
				<select class="form-select form-select-sm pub-year" aria-label="Year">
					<option value="">All years</option>
					${years.map((y) => `<option value="${y}">${y}</option>`).join("")}
				</select>
				<select class="form-select form-select-sm pub-sort" aria-label="Sort">
					<option value="new">Newest first</option>
					<option value="old">Oldest first</option>
					${hasCites ? '<option value="cited">Most cited</option>' : ""}
				</select>
			</div>
			<div class="pub-filter-row mt-2">
				<button type="button" class="btn btn-sm btn-dark pub-type" data-type="">All <span class="pub-n">${items.length}</span></button>
				${types.map(([t, n]) => `<button type="button" class="btn btn-sm btn-outline-dark pub-type" data-type="${t}">${t} <span class="pub-n">${n}</span></button>`).join("")}
				<button type="button" class="btn btn-sm btn-outline-dark pub-first" aria-pressed="false"><i class="fa-solid fa-user"></i> First author</button>
			</div>
			<div class="pub-count mt-2"></div>
		</div></div>`;

		ui = {
			search: wrap.querySelector(".pub-search"),
			year: wrap.querySelector(".pub-year"),
			sort: wrap.querySelector(".pub-sort"),
			types: Array.from(wrap.querySelectorAll(".pub-type")),
			first: wrap.querySelector(".pub-first"),
			count: wrap.querySelector(".pub-count")
		};
		ui.search.addEventListener("input", () => { state.q = ui.search.value.trim().toLowerCase(); apply(); });
		ui.year.addEventListener("change", () => { state.year = ui.year.value; apply(); });
		ui.sort.addEventListener("change", () => { state.sort = ui.sort.value; apply(); });
		ui.types.forEach((b) => b.addEventListener("click", () => { state.type = b.dataset.type; apply(); }));
		ui.first.addEventListener("click", () => { state.first = !state.first; apply(); });
		return wrap;
	}

	function setBtn(btn, on) {
		btn.classList.toggle("btn-dark", on);
		btn.classList.toggle("btn-outline-dark", !on);
	}

	let flat = null;
	let empty = null;

	function apply() {
		if (!ui) return;
		ui.types.forEach((b) => setBtn(b, b.dataset.type === state.type));
		setBtn(ui.first, state.first);
		ui.first.setAttribute("aria-pressed", state.first);

		const terms = state.q.split(/\s+/).filter(Boolean);
		let shown = 0;
		items.forEach((it) => {
			const ok = (!state.year || it.year === +state.year) &&
				(!state.type || it.type === state.type) &&
				(!state.first || it.first) &&
				terms.every((t) => it.text.includes(t));
			it.block.hidden = !ok;
			if (ok) shown++;
		});

		if (state.sort === "cited") {
			// One flat list ordered by citations instead of year sections.
			if (!flat) {
				flat = document.createElement("div");
				flat.className = "row mt-2";
				flat.id = "pubFlat";
				flat.innerHTML = '<h2 class="pub-year-h2">Most cited</h2>';
			}
			container.appendChild(flat);
			items.slice().sort((a, b) => b.cites - a.cites || b.year - a.year || a.order - b.order)
				.forEach((it) => flat.appendChild(it.block));
			rowOrder.forEach((r) => { r.hidden = true; });
			flat.hidden = !shown;
		} else {
			if (flat && flat.parentNode) {
				items.forEach((it) => it.row.appendChild(it.block)); // back to original order
				flat.remove();
			}
			const rows = state.sort === "old" ? rowOrder.slice().reverse() : rowOrder;
			rows.forEach((r) => container.appendChild(r));
			rowOrder.forEach((r) => {
				r.hidden = !Array.from(r.querySelectorAll(":scope > .pub-block")).some((b) => !b.hidden);
			});
		}

		if (!empty) {
			empty = document.createElement("p");
			empty.className = "pub-empty";
			empty.innerHTML = 'No publications match these filters. <a href="#" class="link-dark">Clear filters</a>';
			empty.querySelector("a").addEventListener("click", (e) => { e.preventDefault(); resetFilters(); });
		}
		container.appendChild(empty);
		empty.hidden = shown > 0;
		ui.count.textContent = shown === items.length ? `Showing all ${items.length} publications` : `Showing ${shown} of ${items.length} publications`;
	}

	function resetFilters() {
		if (!ui) return;
		Object.assign(state, { q: "", year: "", type: "", first: false, sort: "new" });
		ui.search.value = ""; ui.year.value = ""; ui.sort.value = "new";
		apply();
	}

	/* ---------- build ---------- */
	function build(data) {
		const top = document.createElement("div");
		top.id = "pubTop";
		let blockFor = null;
		if (data) {
			blockFor = mergeScholar(data);
			const c = carousel(data, blockFor);
			if (c) top.appendChild(c);
			top.appendChild(metricsRow(data));
		}
		collect();
		top.appendChild(filterBar(!!data));
		container.insertBefore(top, container.firstElementChild);
		apply();

		if (data && window.bootstrap && bootstrap.Carousel) {
			const el = document.getElementById("topCited");
			if (el) bootstrap.Carousel.getOrCreateInstance(el, { interval: 7000, ride: "carousel" }).cycle();
		}
	}

	fetch("data/scholar.json", { cache: "no-cache" })
		.then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
		.then((data) => build(data))
		.catch(() => build(null));
})();
