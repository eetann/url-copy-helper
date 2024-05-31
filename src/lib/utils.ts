import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
	return twMerge(clsx(args));
}

export async function getCurrentTab() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab;
}

export const dictKeys = [
	"Markdown",
	"HTML",
	"URL",
	"Title",
	"WikiLink",
] as const;
export type DictKey = (typeof dictKeys)[number];

export const isDictKey = (key: string | number): key is DictKey => {
	return dictKeys.some((val) => val === key);
};

export type TextDict = Record<DictKey, string>;

export const formatDict: Record<DictKey, string> = {
	Markdown: "[title](URL)",
	HTML: "<a href='URL'>title</a>",
	URL: "URL",
	Title: "title",
	WikiLink: "[[URL|title]]",
};

export async function copyText(
	key: DictKey | string | number,
	_title: string | undefined,
	_url: string | undefined,
) {
	if (typeof key === "number") {
		return;
	}

	let title = _title ?? "No Title";
	// NOTE: chrome.tabs.queryで取得したURLはエンコード済み
	const url = _url ?? "No URL";
	if (/github.com\/[^\/]*\/[^\/]*$/.test(url)) {
		const capture = /\/(.*):.*$/.exec(title);
		if (capture?.[1]) {
			title = capture[1];
		}
	}

	function getUrl() {
		return url;
	}

	function getTitle() {
		return title;
	}

	function getHTML() {
		return `<a href="${url}">${title}</a>`;
	}

	function getMarkdown() {
		return `[${title}](${url})`;
	}

	function getWikiLink() {
		return `[[${url}|${title}]]`;
	}

	function getText(key: string): string {
		switch (key) {
			case "Markdown":
				return getMarkdown();
			case "HTML":
				return getHTML();
			case "URL":
				return getUrl();
			case "Title":
				return getTitle();
			case "WikiLink":
				return getWikiLink();
		}
		return "";
	}

	const item = [
		new ClipboardItem({
			"text/html": new Blob([getHTML()], { type: "text/html" }),
			"text/plain": new Blob([getText(key)], { type: "text/plain" }),
		}),
	];
	await navigator.clipboard.write(item);
	// TODO: アイコンの一時的な変更
}

export async function copyTextFromServideWorker(
	key: DictKey | string | number,
) {
	const tab = await getCurrentTab();
	if (!tab.id) {
		return;
	}
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		args: [key, tab.title, tab.url],
		func: copyText,
	});
}
