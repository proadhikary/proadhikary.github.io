/* Projects page: turns the project cards in projects.html into a clean list
   grouped by year. projects.html stays the source of truth: to add a project,
   copy an existing "clickable" card there (URL, title, stack, date, text). */
(function () {
	var root = document.querySelector("#tutorialsContent .container");
	if (!root) return;
	var cards = Array.prototype.slice.call(root.querySelectorAll(":scope > .clickable"));
	if (!cards.length) return;

	function esc(s) {
		return s.replace(/[&<>"]/g, function (c) {
			return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
		});
	}
	function clean(s) { return (s || "").replace(/\s+/g, " ").trim(); }
	function ghLabel(u) { return u.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, ""); }
	function link(u, icon, text) {
		return '<a class="proj-link" href="' + esc(u) + '" target="_blank" rel="noopener"><i class="' + icon + '"></i> ' + esc(text) + "</a>";
	}

	var projects = cards.map(function (card) {
		// The hidden div may hold one URL, or a live URL followed by a GitHub URL.
		var urls = clean(card.querySelector(".d-none").textContent).split(" ");
		var url = urls[0], repo = urls[1] || "";
		var title = clean(card.querySelector(".h5").textContent).replace(/^[^\w(]+/, "");
		var split = title.match(/^(.+?)\s*[:|]\s*(.+)$/);
		var stackEl = card.querySelector(".fa-computer");
		var dateEl = card.querySelector(".fa-calendar");
		var date = dateEl ? clean(dateEl.parentNode.textContent) : "";
		var host = "";
		try { host = new URL(url).hostname.replace(/^www\./, ""); } catch (e) {}
		return {
			url: url,
			name: split ? split[1] : title,
			sub: split ? split[2] : "",
			stack: stackEl ? clean(stackEl.parentNode.textContent).split(/\s*,\s*/).filter(Boolean) : [],
			month: date.replace(/\s*\d{4}$/, ""),
			year: (date.match(/\d{4}/) || [""])[0],
			desc: clean(card.querySelector(".blog-short").textContent),
			code: host === "github.com",
			label: host === "github.com" ? ghLabel(url) : host,
			repo: repo
		};
	});

	var years = [];
	projects.forEach(function (p) { if (years.indexOf(p.year) < 0) years.push(p.year); });

	var html = "";

	years.forEach(function (y) {
		html += '<section class="proj-year"><h2 class="proj-year-h2">' + esc(y) + "</h2>";
		projects.filter(function (p) { return p.year === y; }).forEach(function (p) {
			html += '<article class="proj-item">' +
				'<div class="proj-head"><h3 class="proj-title">' +
				'<a href="' + esc(p.url) + '" target="_blank" rel="noopener" class="link-dark">' + esc(p.name) + "</a>" +
				(p.sub ? '<span class="proj-sub">' + esc(p.sub) + "</span>" : "") +
				'</h3><span class="proj-date">' + esc(p.month) + "</span></div>" +
				'<p class="proj-desc">' + esc(p.desc) + "</p>" +
				'<div class="proj-meta"><span class="proj-tags">' +
				p.stack.map(function (s) { return '<span class="proj-tag">' + esc(s) + "</span>"; }).join("") +
				"</span>" +
				'<span class="proj-links">' +
				link(p.url, p.code ? "fa-brands fa-github" : "fa-solid fa-arrow-up-right-from-square", p.label) +
				(p.repo ? link(p.repo, "fa-brands fa-github", ghLabel(p.repo)) : "") +
				"</span></div></article>";
		});
		html += "</section>";
	});

	var list = document.createElement("div");
	list.className = "proj-list";
	list.innerHTML = html;
	cards.forEach(function (c) { c.remove(); });
	root.appendChild(list);
})();
