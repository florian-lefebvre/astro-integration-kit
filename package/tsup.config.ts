import { defineConfig } from "tsup";
import packageJson from "./package.json";

export default defineConfig((options) => {
	const dev = !!options.watch;
	return {
		entry: ["src/**/*.(ts|js)", "!src/internal/internal.d.ts"],
		format: ["esm"],
		target: "node18",
		bundle: true,
		dts: true,
		sourcemap: true,
		clean: true,
		splitting: false,
		minify: !dev,
		external: [...Object.keys(packageJson.peerDependencies)],
		tsconfig: "tsconfig.build.json",
	};
});
