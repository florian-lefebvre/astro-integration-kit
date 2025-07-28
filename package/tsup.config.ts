import { defineConfig } from "tsup";
import packageJson from "./package.json";

export default defineConfig((options) => {
	const dev = !!options.watch;
	return [
		// Main build - minified (excluding import-fresh)
		{
			entry: [
				"src/**/*.(ts|js)",
				"!src/internal/internal.d.ts",
				"!src/dev/import-fresh.ts",
			],
			format: ["esm"],
			target: "node18",
			bundle: true,
			dts: true,
			sourcemap: true,
			clean: false,
			splitting: false,
			minify: !dev,
			external: [
				...Object.keys(packageJson.peerDependencies),
			],
			tsconfig: "tsconfig.build.json",
		},
		// import-fresh build - not minified to preserve @vite-ignore
		{
			entry: { "dev/import-fresh": "src/dev/import-fresh.ts" },
			format: ["esm"],
			target: "node18",
			bundle: true,
			dts: true,
			sourcemap: true,
			clean: false,
			splitting: false,
			minify: false,
			external: [...Object.keys(packageJson.peerDependencies)],
			tsconfig: "tsconfig.build.json",
		},
	];
});
