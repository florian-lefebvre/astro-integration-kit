import {
	addVirtualImport,
	createResolver,
	defineIntegration,
	watchIntegration,
} from "astro-integration-kit";
import { z } from "astro/zod";

const testIntegration = defineIntegration({
	name: "test-integration",
	options: z.object({
		name: z.string().optional(),
	}),
	defaultOptions: {
		name: "abc",
	},
	setup: (options) => {
		const { resolve } = createResolver(import.meta.url);

		const pluginPath = resolve("./plugin.ts");
		console.log({ options, pluginPath });

		return {
			"astro:config:setup": async ({ addWatchFile, command, updateConfig }) => {
				await watchIntegration({
					addWatchFile,
					command,
					dir: resolve(),
					updateConfig,
				});
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
