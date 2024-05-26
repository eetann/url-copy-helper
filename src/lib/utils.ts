import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export type TextDict = Record<string, {
  name: string;
  format: string;
  text: string;
}>;

export class CopyUrlHelper {
  private title;
  private url;
  private githubOnlyRepo = true;
  constructor(title: string, url: string, githubOnlyRepo?: boolean) {
    this.title = title
    if (this.githubOnlyRepo && /github.com\/[^\/]*\/[^\/]*$/.test(url)) {
      const capture = /\/(.*):.*$/.exec(title);
      if (capture && capture[1]) {
        this.title = capture[1];
      }
    }
    this.url = url;
    if (githubOnlyRepo != undefined) {
      // TODO: エンコード？
      this.githubOnlyRepo = githubOnlyRepo;
    }
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
    return `[${this.title}](${this.url})`
  }

  getWikiLink() {
    return `[[${this.url}|${this.title}]]`
  }

  getTextDict(): TextDict {
    return {
      markdown: { name: "Markdown", format: "[title](URL)", text: this.getMarkdown() },
      html: { name: "HTML", format: "<a href='URL'>title</a>", text: this.getHTML() },
      url: { name: "URL", format: "URL", text: this.getUrl() },
      title: { name: "Title", format: "title", text: this.getTitle() },
      wikiLink: { name: "wikiLink", format: "[[URL|title]]", text: this.getWikiLink() },
    };
  }
}
