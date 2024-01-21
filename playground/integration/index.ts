import type { AstroIntegration } from "astro";
import { createResolver } from "astro-integration-kit";

const testIntegration = (): AstroIntegration => {
	const { resolve } = createResolver(import.meta.url);

	const pluginPath = resolve("./plugin.ts");
	console.log({ pluginPath });

	return {
		name: "test-integration",
		hooks: {},
	};
};

export default testIntegration;
