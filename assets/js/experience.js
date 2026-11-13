/* EXPERIENCE timeline focus
 * Each role (an .academic-name plus the lines under it) becomes an .exp-item.
 * The role under the mouse, or else the one crossing the middle of the screen
 * while scrolling, gets .is-active: its dot fills and the others fade back.
 */
(function () {
	const root = document.getElementById("academicContent");
	if (!root) return;

	// Group every role and its details into one element.
	root.querySelectorAll(".academic-block").forEach((block) => {
		let item = null;
		Array.from(block.childNodes).forEach((node) => {
			if (node.nodeType === 1 && node.classList.contains("academic-name")) {
				item = document.createElement("div");
				item.className = "exp-item";
				block.insertBefore(item, node);
			}
			if (item) item.appendChild(node);
		});
	});

	const items = Array.from(root.querySelectorAll(".exp-item"));
	if (!items.length) return;
	root.classList.add("exp-focus");

	let hovered = null;
	let current = null;

	function fromScroll() {
		const line = window.innerHeight * 0.4;
		const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
		let pick = items[0];
		for (const it of items) {
			const top = it.getBoundingClientRect().top;
			if (atBottom ? top < window.innerHeight - 80 : top <= line) pick = it;
		}
		return pick;
	}

	function update() {
		const next = hovered || fromScroll();
		if (next === current) return;
		if (current) current.classList.remove("is-active");
		next.classList.add("is-active");
		current = next;
	}

	let ticking = false;
	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => { ticking = false; update(); });
	}

	items.forEach((it) => {
		it.addEventListener("mouseenter", () => { hovered = it; update(); });
		it.addEventListener("mouseleave", () => { if (hovered === it) hovered = null; update(); });
	});
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll);
	update();
})();
