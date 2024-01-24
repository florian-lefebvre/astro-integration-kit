import {
	createResolver,
	defineIntegration,
	hasIntegration,
	watchIntegration,
} from "astro-integration-kit";
import { addVirtualImport } from "astro-integration-kit/vanilla";

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
			"astro:config:setup": ({ updateConfig }) => {
				watchIntegration(resolve());

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
