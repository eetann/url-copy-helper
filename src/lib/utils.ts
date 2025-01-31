import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { browser } from "wxt/browser";

export function cn(...args: ClassValue[]) {
	return twMerge(clsx(args));
}

export async function getCurrentTab() {
	const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
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
): Promise<boolean> {
	if (typeof key === "number") {
		return false;
	}

	let title = _title ?? "No Title";
	// NOTE: browser.tabs.queryで取得したURLはエンコード済み
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

	try {
		const item = [
			new ClipboardItem({
				"text/html": new Blob([getHTML()], { type: "text/html" }),
				"text/plain": new Blob([getText(key)], { type: "text/plain" }),
			}),
		];
		await navigator.clipboard.write(item);
		return true;
	} catch (e) {
		console.log(e);
	}
	return false;
}

export async function copyTextFromServideWorker(
	key: DictKey | string | number,
) {
	const tab = await getCurrentTab();
	if (!tab.id) {
		return;
	}
	const [{ result }] = await browser.scripting.executeScript({
		target: { tabId: tab.id },
		args: [key, tab.title, tab.url],
		func: copyText,
	});
	if (result) {
		changeIcon();
	}
}

export function changeIcon() {
	if (import.meta.env.MANIFEST_VERSION === 2) {
		browser.browserAction.setIcon({ path: "icon/48-check.png" });
		setTimeout(() => {
			browser.browserAction.setIcon({ path: "icon/48.png" });
		}, 3000);
	} else {
		browser.action.setIcon({ path: "icon/48-check.png" });
		setTimeout(() => {
			browser.action.setIcon({ path: "icon/48.png" });
		}, 3000);
	}
}
