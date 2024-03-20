import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/core/index.ts",
		utilities: "src/utilities/index.ts",
		plugins: "src/plugins/index.ts",
	},
	format: ["esm"],
	target: "node18",
	bundle: true,
	dts: true,
	sourcemap: true,
	clean: true,
	splitting: false,
	minify: true,
	external: ["astro"],
	tsconfig: "tsconfig.build.json",
});
