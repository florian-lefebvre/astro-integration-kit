import { readFile } from "node:fs/promises";
import {
	addVirtualImport,
	createResolver,
	defineIntegration,
} from "astro-integration-kit";

const testIntegration = defineIntegration<{ name?: string | undefined }>({
	name: "test-integration",
	defaults: {
		name: "abc",
	},
	setup: ({ options }) => {
		const { resolve } = createResolver(import.meta.url);

		const pluginPath = resolve("./plugin.ts");
		console.log({ options, pluginPath });

		return {
			"astro:config:setup": async ({
				updateConfig,
				watchIntegration,
				hasIntegration,
				addDts
			}) => {
				watchIntegration(resolve());

				addDts({
					name: "test-integration",
					content: await readFile(resolve("./virtual.d.ts"), "utf-8"),
				});

				addVirtualImport({
					name: "virtual:astro-integration-kit-playground/config",
					content: `export default ${JSON.stringify({ foo: "bar" })}`,
					updateConfig,
				});

				if (hasIntegration("@astrojs/tailwind")) {
					console.log("Tailwind is installed");
				}
			},
		};
	},
});

export default testIntegration;
