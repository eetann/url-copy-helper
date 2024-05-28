import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export async function getCurrentHelper() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const title = tab.title ?? "No Titile";
  const url = tab.url ?? "No URL";
  return new CopyUrlHelper(title, url, true);
}

export const dictKeys = [
  "Markdown",
  "HTML",
  "URL",
  "Title",
  "WikiLink",
] as const;
export type DictKey = (typeof dictKeys)[number];

const isDictKey = (key: string): key is DictKey => {
  return dictKeys.some((val) => val === key);
};

export type TextDict = Record<
  DictKey,
  {
    format: string;
    text: string;
  }
>;

export class CopyUrlHelper {
  private title;
  private url;
  constructor(title: string, url: string, githubOnlyRepo: boolean) {
    this.title = title;
    if (githubOnlyRepo && /github.com\/[^\/]*\/[^\/]*$/.test(url)) {
      const capture = /\/(.*):.*$/.exec(title);
      if (capture?.[1]) {
        this.title = capture[1];
      }
    }
    // NOTE: chrome.tabs.queryで取得したURLはエンコード済み
    this.url = url;
  }

  getUrl() {
    return this.url;
  }

  getTitle() {
    return this.title;
  }

  getHTML() {
    return `<a href="${this.url}">${this.title}</a>`;
  }

  getMarkdown() {
    return `[${this.title}](${this.url})`;
  }

  getWikiLink() {
    return `[[${this.url}|${this.title}]]`;
  }

  getTextDict(): TextDict {
    return {
      Markdown: {
        format: "[title](URL)",
        text: this.getMarkdown(),
      },
      HTML: {
        format: "<a href='URL'>title</a>",
        text: this.getHTML(),
      },
      URL: { format: "URL", text: this.getUrl() },
      Title: { format: "title", text: this.getTitle() },
      WikiLink: {
        format: "[[URL|title]]",
        text: this.getWikiLink(),
      },
    };
  }
}

export async function copyText(
  textDict: TextDict | undefined,
  key: DictKey | string,
) {
  if (!textDict || !isDictKey(key)) {
    return;
  }
  const text = textDict[key].text;
  const item = [
    new ClipboardItem({
      "text/html": new Blob([textDict.HTML.text], { type: "text/html" }),
      "text/plain": new Blob([text], { type: "text/plain" }),
    }),
  ];
  await navigator.clipboard.write(item);
}
