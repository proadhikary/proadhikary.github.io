/* LAB REGISTRY
 * Every tool or game in the Lab is one entry here. tools.html renders the
 * grid from this list, so adding a tool = make tools/<id>/index.html + add an entry.
 *
 *   id        folder name under tools/
 *   category  one of the keys in LAB_CATEGORIES
 *   icon      Font Awesome class (fa-solid ...)
 *   color     card icon background
 *   isNew     shows a "new" tag on the card
 */
window.LAB_CATEGORIES = {
	pdf: { en: "PDF", es: "পিডিএফ" },
	image: { en: "Image", es: "ছবি" },
	research: { en: "Research", es: "গবেষণা" },
	text: { en: "Text", es: "লেখা" },
	games: { en: "Games", es: "গেম" }
};

window.LAB_TOOLS = [
	{
		id: "pdf-merge",
		category: "pdf",
		icon: "fa-solid fa-object-group",
		color: "#8a2b22",
		title: { en: "Merge PDF", es: "পিডিএফ যুক্ত করুন" },
		desc: { en: "Combine several PDFs into one, in the order you choose.", es: "একাধিক পিডিএফ আপনার পছন্দের ক্রমে একটিতে যুক্ত করুন।" }
	},
	{
		id: "pdf-split",
		category: "pdf",
		icon: "fa-solid fa-scissors",
		color: "#a8432f",
		title: { en: "Split & Extract PDF", es: "পিডিএফ ভাগ করুন" },
		desc: { en: "Pull out page ranges, or split every page into its own file.", es: "নির্দিষ্ট পৃষ্ঠা বের করুন বা প্রতিটি পৃষ্ঠা আলাদা করুন।" }
	},
	{
		id: "images-to-pdf",
		category: "pdf",
		icon: "fa-solid fa-file-image",
		color: "#b8582f",
		title: { en: "Images to PDF", es: "ছবি থেকে পিডিএফ" },
		desc: { en: "Turn JPG/PNG scans or photos into a single PDF.", es: "জেপিজি/পিএনজি ছবি দিয়ে একটি পিডিএফ তৈরি করুন।" }
	},
	{
		id: "image-compress",
		category: "image",
		icon: "fa-solid fa-compress",
		color: "#2f6b5f",
		title: { en: "Compress & Resize Image", es: "ছবি ছোট করুন" },
		desc: { en: "Shrink, resize and convert images to JPG, PNG or WebP.", es: "ছবির আকার কমান, রিসাইজ ও ফরম্যাট বদলান।" }
	},
	{
		id: "bibtex-format",
		category: "research",
		icon: "fa-solid fa-quote-right",
		color: "#1e3a5f",
		title: { en: "BibTeX Formatter", es: "বিবটেক্স ফরম্যাটার" },
		desc: { en: "Paste BibTeX, get APA, IEEE, MLA or Chicago references.", es: "বিবটেক্স থেকে APA, IEEE, MLA রেফারেন্স তৈরি করুন।" },
		isNew: true
	},
	{
		id: "word-count",
		category: "text",
		icon: "fa-solid fa-paragraph",
		color: "#4a4f7a",
		title: { en: "Word Counter & Readability", es: "শব্দ গণনা" },
		desc: { en: "Words, characters, reading time and Flesch readability for abstracts.", es: "শব্দ, অক্ষর, পড়ার সময় ও পাঠযোগ্যতা দেখুন।" }
	},
	{
		id: "qr-code",
		category: "text",
		icon: "fa-solid fa-qrcode",
		color: "#3d4148",
		title: { en: "QR Code Maker", es: "কিউআর কোড" },
		desc: { en: "QR codes for posters and slides. Download as PNG or SVG.", es: "পোস্টার ও স্লাইডের জন্য কিউআর কোড তৈরি করুন।" }
	},
	{
		id: "reviewer-2",
		category: "games",
		icon: "fa-solid fa-gamepad",
		color: "#b8901f",
		title: { en: "Reviewer #2", es: "রিভিউয়ার #২" },
		desc: { en: "Steer your manuscript past rejection stamps and collect citations.", es: "রিজেকশন এড়িয়ে সাইটেশন সংগ্রহ করুন। একটি ছোট গেম।" },
		isNew: true
	}
];
