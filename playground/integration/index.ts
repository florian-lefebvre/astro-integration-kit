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
			"astro:config:setup": ({
				updateConfig,
				watchIntegration,
				hasIntegration,
			}) => {
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
