import { readFileSync } from "node:fs";
import {
	createResolver,
	defineIntegration,
	defineOptions,
} from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";

const testIntegration = defineIntegration({
	name: "test-integration",
	options: defineOptions<{ name?: string | undefined }>({ name: "abc" }),
	plugins: [...corePlugins],
	setup: ({ options }) => {
		const { resolve } = createResolver(import.meta.url);

		const pluginPath = resolve("./plugin.ts");
		console.log({ options, pluginPath });

		return {
			"astro:config:setup": ({
				addVirtualImport,
				// watchIntegration,
				// hasIntegration,
				addDts,
			}) => {
				watchIntegration(resolve());

				addDts({
					name: "test-integration",
					content: readFileSync(resolve("./virtual.d.ts"), "utf-8"),
				});

				addVirtualImport({
					name: "virtual:astro-integration-kit-playground/config",
					content: `export default ${JSON.stringify({ foo: "bar" })}`,
				});

				if (hasIntegration("@astrojs/tailwind")) {
					console.log("Tailwind is installed");
				}

				if (hasIntegration("@astrojs/tailwind", "before")) {
					console.log("Tailwind is installed before this");
				}

				if (hasIntegration("integration-a", "after")) {
					console.log("Integration A is installed after this");
				}

				if (hasIntegration("integration-a", "before", "integration-b")) {
					console.log("Integration A is installed before Integration B");
				}

				if (hasIntegration("integration-b", "after", "integration-a")) {
					console.log("Integration B is installed after Integration A");
				}
			},
		};
	},
});

export default testIntegration;
