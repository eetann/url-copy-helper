import { defineConfig } from "wxt";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "node:path";

// See https://wxt.dev/api/config.html
export default defineConfig({
	manifest: {
		permissions: ["tabs", "contextMenus", "activeTab", "scripting"],
		commands: {
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
