/* Shared helpers for Lab tools. Exposes window.Lab. No dependencies. */
(function () {
	const Lab = {};

	// Header + footer. Each tool page has <header id="tool-nav"> and <footer id="tool-footer">.
	Lab.chrome = function (title) {
		const nav = document.getElementById("tool-nav");
		if (nav) {
			nav.className = "tool-nav";
			nav.innerHTML =
				'<div class="tool-nav-inner">' +
				'<a class="tool-brand" href="../../index.html">P K A</a>' +
				'<nav class="tool-crumbs" aria-label="Breadcrumb">' +
				'<a href="../../tools.html">Lab</a><span aria-hidden="true">/</span><span>' + Lab.escape(title) + "</span>" +
				"</nav></div>";
		}
		const foot = document.getElementById("tool-footer");
		if (foot) {
			foot.className = "tool-footer";
			foot.innerHTML =
				'Part of the <a href="../../tools.html">Lab</a> by ' +
				'<a href="../../index.html">Prottay Kumar Adhikary</a>. Runs entirely in your browser.';
		}
	};

	Lab.escape = function (s) {
		return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
	};

	Lab.formatBytes = function (n) {
		if (n < 1024) return n + " B";
		if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
		return (n / (1024 * 1024)).toFixed(2) + " MB";
	};

	// Wire a .dropzone element. onFiles receives an array of File.
	Lab.dropzone = function (el, { accept, multiple = true, onFiles }) {
		const input = document.createElement("input");
		input.type = "file";
		if (accept) input.accept = accept;
		input.multiple = multiple;
		el.appendChild(input);
		el.tabIndex = 0;
		el.setAttribute("role", "button");

		const matches = (f) => {
			if (!accept) return true;
			return accept.split(",").some((a) => {
				a = a.trim();
				if (a.startsWith(".")) return f.name.toLowerCase().endsWith(a);
				if (a.endsWith("/*")) return f.type.startsWith(a.slice(0, -1));
				return f.type === a;
			});
		};
		const take = (list) => {
			const files = Array.from(list).filter(matches);
			if (files.length) onFiles(multiple ? files : files.slice(0, 1));
		};

		el.addEventListener("click", () => input.click());
		el.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				input.click();
			}
		});
		input.addEventListener("change", () => {
			take(input.files);
			input.value = "";
		});
		el.addEventListener("dragover", (e) => {
			e.preventDefault();
			el.classList.add("is-over");
		});
		el.addEventListener("dragleave", () => el.classList.remove("is-over"));
		el.addEventListener("drop", (e) => {
			e.preventDefault();
			el.classList.remove("is-over");
			take(e.dataTransfer.files);
		});
	};

	Lab.download = function (data, filename, type) {
		const blob = data instanceof Blob ? data : new Blob([data], { type: type || "application/octet-stream" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(url), 4000);
	};

	Lab.status = function (el, msg, kind) {
		el.textContent = msg || "";
		el.className = "status" + (kind ? " " + kind : "");
	};

	Lab.copy = async function (text, btn) {
		try {
			await navigator.clipboard.writeText(text);
			if (btn) {
				const old = btn.innerHTML;
				btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
				setTimeout(() => (btn.innerHTML = old), 1400);
			}
		} catch (e) {
			/* clipboard blocked; nothing else to do */
		}
	};

	// Drag-to-reorder for a <ul> whose <li> carry data-index. onReorder(from, to).
	Lab.sortable = function (ul, onReorder) {
		let from = null;
		ul.addEventListener("dragstart", (e) => {
			const li = e.target.closest("li[data-index]");
			if (!li) return;
			from = +li.dataset.index;
			li.classList.add("dragging");
			e.dataTransfer.effectAllowed = "move";
		});
		ul.addEventListener("dragend", (e) => {
			const li = e.target.closest("li");
			if (li) li.classList.remove("dragging");
		});
		ul.addEventListener("dragover", (e) => e.preventDefault());
		ul.addEventListener("drop", (e) => {
			e.preventDefault();
			const li = e.target.closest("li[data-index]");
			if (li && from !== null) onReorder(from, +li.dataset.index);
			from = null;
		});
	};

	Lab.move = function (arr, from, to) {
		if (to < 0 || to >= arr.length || from === to) return arr;
		const [x] = arr.splice(from, 1);
		arr.splice(to, 0, x);
		return arr;
	};

	window.Lab = Lab;
})();
