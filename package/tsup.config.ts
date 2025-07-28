import { defineConfig } from "tsup";
import packageJson from "./package.json";

export default defineConfig((options) => {
	const dev = !!options.watch;
	return [
		{
			entry: [
				"src/**/*.(ts|js)",
				"!src/internal/internal.d.ts",
				"!src/dev/import-fresh.ts",
				"!src/dev/hmr-integration.ts",
				"!src/dev/index.ts",
			],
			format: ["esm"],
			target: "node18",
			bundle: true,
			dts: true,
			sourcemap: true,
			clean: false, // so we don't delete the other build's output
			splitting: false,
			minify: !dev,
			external: [...Object.keys(packageJson.peerDependencies)],
			tsconfig: "tsconfig.build.json",
		},
		// Second build so we don't strip @vite-ignore comments
		{
			entry: {
				"dev/index": "src/dev/index.ts",
				"dev/import-fresh": "src/dev/import-fresh.ts",
				"dev/hmr-integration": "src/dev/hmr-integration.ts",
			},
			format: ["esm"],
			target: "node18",
			bundle: true,
			dts: true,
			sourcemap: true,
			clean: false, // so we don't delete the other build's output
			splitting: false,
			minify: false,
			external: [...Object.keys(packageJson.peerDependencies)],
			tsconfig: "tsconfig.build.json",
		},
	];
});
