import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	manifest: {
		name: "URL Copy Helper",
		version: "1.0.4",
		description: "Copy current URL and Title. Rich Text is avalable!",
		permissions: ["tabs", "contextMenus", "activeTab", "scripting"],
		action: {
			default_popup: "popup.html",
			default_icon: {
				"32": "icon/32.png",
				"48": "icon/48.png",
				"96": "icon/96.png",
				"128": "icon/128.png",
			},
		},
		commands: {
			// popup: {
			// 	description: "Open popup view",
			// },
			Markdown: {
				description: "Copy in Markdown format",
			},
			HTML: {
				description: "Copy in HTML format",
			},
			URL: {
				description: "Copy in URL format",
			},
			Title: {
				description: "Copy in Title format",
			},
			WikiLink: {
				description: "Copy in WikiLink format",
			},
		},
		// for forefox
		browser_specific_settings: {
			gecko: {
				id: "url-copy-helper@eetann",
			},
		},
	},
	srcDir: "src",
	vite: () => ({
		resolve: {
			alias: {
				$lib: path.resolve("./src/lib"),
			},
		},
		plugins: [
			svelte({
				// Using a svelte.config.js file causes a segmentation fault when importing the file
				configFile: path.resolve("./svelte.config.mjs"),
			}),
		],
	}),
});
