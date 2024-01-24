import {
	createResolver,
	defineIntegration,
	watchIntegration,
} from "astro-integration-kit";
import { addVirtualImport } from "astro-integration-kit/vanilla";

const testIntegration = defineIntegration<{ name?: string }>({
	name: "test-integration",
	defaults: {
		name: "abc",
	},
	setup: ({ options }) => {
		const { resolve } = createResolver(import.meta.url);

		const pluginPath = resolve("./plugin.ts");
		console.log({ options, pluginPath });

		return {
			"astro:config:setup": async ({ updateConfig }) => {
				await watchIntegration(resolve());

				addVirtualImport({
					name: "virtual:astro-integration-kit-playground/config",
					content: `export default ${JSON.stringify({ foo: "bar" })}`,
					updateConfig,
				});
			},
		};
	},
});

export default testIntegration;
