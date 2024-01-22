import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(fileURLToPath(new URL("./src/index.ts", import.meta.url))),
			formats: ["es"],
			fileName: "index",
		},
		rollupOptions: {
			external: [
				"node:url",
				"node:path",
				"node:async_hooks",
				"node:fs/promises",
			],
		},
	},
	plugins: [dts()],
});
