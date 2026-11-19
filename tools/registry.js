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
	{ id: "pdf-page-numbers", category: "pdf", icon: "fa-solid fa-list-ol", color: "#8a2b22", isNew: true, title: { en: "Add Page Numbers to PDF", es: "পিডিএফে পৃষ্ঠা নম্বর যোগ করুন" }, desc: { en: "Number the pages of a PDF, with your choice of position, format and start number.", es: "পছন্দমতো অবস্থান, ধরন ও শুরুর নম্বর দিয়ে পিডিএফের পৃষ্ঠায় নম্বর বসান।" } },
	{ id: "pdf-rotate", category: "pdf", icon: "fa-solid fa-rotate-right", color: "#8a2b22", isNew: true, title: { en: "Rotate & Delete PDF Pages", es: "পিডিএফ পৃষ্ঠা ঘোরান ও মুছুন" }, desc: { en: "Turn sideways pages upright and remove pages you don't need, with previews.", es: "প্রিভিউ দেখে কাত হওয়া পৃষ্ঠা সোজা করুন আর অপ্রয়োজনীয় পৃষ্ঠা বাদ দিন।" } },
	{ id: "strip-metadata", category: "image", icon: "fa-solid fa-location-dot", color: "#2f6b5f", isNew: true, title: { en: "Remove Photo Metadata", es: "ছবির মেটাডেটা মুছুন" }, desc: { en: "See the camera, date and GPS location hidden in your photos, then save clean copies.", es: "ছবিতে লুকানো ক্যামেরা, তারিখ ও জিপিএস অবস্থান দেখুন, তারপর পরিষ্কার কপি সংরক্ষণ করুন।" } },
	{ id: "latex-table", category: "research", icon: "fa-solid fa-table", color: "#1e3a5f", isNew: true, title: { en: "LaTeX Table Maker", es: "লেটেক টেবিল নির্মাতা" }, desc: { en: "Paste cells from a spreadsheet or CSV and get a booktabs LaTeX table.", es: "স্প্রেডশিট বা CSV থেকে ঘর পেস্ট করে booktabs লেটেক টেবিল পান।" } },
	{ id: "author-format", category: "research", icon: "fa-solid fa-users", color: "#1e3a5f", isNew: true, title: { en: "Author List Formatter", es: "লেখক তালিকা বিন্যাসক" }, desc: { en: "Turn a list of author names into IEEE, APA, Vancouver, plain or BibTeX format.", es: "লেখকদের নামের তালিকাকে IEEE, APA, Vancouver, সাধারণ বা BibTeX বিন্যাসে রূপান্তর করুন।" } },
	{ id: "agreement", category: "research", icon: "fa-solid fa-handshake", color: "#1e3a5f", isNew: true, title: { en: "Annotator Agreement", es: "অ্যানোটেটর সম্মতি" }, desc: { en: "Percent agreement, Cohen's and Fleiss' kappa, and a confusion matrix for your annotation labels.", es: "আপনার অ্যানোটেশন লেবেলের জন্য শতকরা সম্মতি, কোহেন ও ফ্লেইস কাপ্পা এবং কনফিউশন ম্যাট্রিক্স।" } },
	{ id: "metrics", category: "research", icon: "fa-solid fa-bullseye", color: "#1e3a5f", isNew: true, title: { en: "Classification Metrics", es: "ক্লাসিফিকেশন মেট্রিক্স" }, desc: { en: "Precision, recall and F1 per class from a confusion matrix or label lists, copied as Markdown or LaTeX.", es: "কনফিউশন ম্যাট্রিক্স বা লেবেল তালিকা থেকে প্রতি ক্লাসের প্রিসিশন, রিকল ও F1, মার্কডাউন বা LaTeX হিসেবে কপি করুন।" } },
	{ id: "deadline", category: "research", icon: "fa-solid fa-hourglass-half", color: "#1e3a5f", isNew: true, title: { en: "Deadline Converter (AoE)", es: "ডেডলাইন রূপান্তর (AoE)" }, desc: { en: "See an AoE or other time zone deadline in your local time, with a live countdown and a shareable link.", es: "AoE বা অন্য টাইম জোনের ডেডলাইন আপনার স্থানীয় সময়ে দেখুন, লাইভ কাউন্টডাউন ও শেয়ারযোগ্য লিংকসহ।" } },
	{ id: "sample-size", category: "research", icon: "fa-solid fa-square-poll-vertical", color: "#1e3a5f", isNew: true, title: { en: "Sample Size & Margin of Error", es: "নমুনার আকার ও ত্রুটির সীমা" }, desc: { en: "Find how many survey responses you need, or the margin of error for the responses you have.", es: "জরিপে কতগুলো উত্তর দরকার, অথবা আপনার উত্তরগুলোর ত্রুটির সীমা কত, তা বের করুন।" } },
	{ id: "clean-text", category: "text", icon: "fa-solid fa-broom", color: "#3d4148", isNew: true, title: { en: "Clean Pasted Text", es: "পেস্ট করা লেখা পরিষ্কার করুন" }, desc: { en: "Fix text copied from a PDF: join broken lines, repair split words and tidy spaces and quotes.", es: "পিডিএফ থেকে কপি করা লেখা ঠিক করুন: ভাঙা লাইন জোড়া দিন, ভাঙা শব্দ মেলান, ফাঁকা জায়গা ও উদ্ধৃতিচিহ্ন গুছিয়ে নিন।" } },
	{ id: "text-diff", category: "text", icon: "fa-solid fa-code-compare", color: "#3d4148", isNew: true, title: { en: "Compare Texts", es: "লেখা তুলনা করুন" }, desc: { en: "See what changed between two versions of a text, word by word or line by line.", es: "একটি লেখার দুটি সংস্করণের মধ্যে কী বদলেছে তা শব্দ বা লাইন ধরে দেখুন।" } },
	{ id: "team-picker", category: "text", icon: "fa-solid fa-shuffle", color: "#3d4148", isNew: true, title: { en: "Random Picker & Groups", es: "এলোমেলো বাছাই ও দল গঠন" }, desc: { en: "Pick a random name, draw several, split a list into groups or shuffle the order.", es: "এলোমেলোভাবে একটি নাম বাছুন, কয়েকটি তুলুন, তালিকা দলে ভাগ করুন বা ক্রম এলোমেলো করুন।" } },
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
