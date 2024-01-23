import {
	createResolver,
	defineIntegration,
	watchIntegration,
} from "astro-integration-kit";
import { addVirtualImport } from "astro-integration-kit/vanilla";
import { z } from "astro/zod";

const testIntegration = defineIntegration({
	name: "test-integration",
	options: z.object({
		name: z.string().optional().default("abc"),
	}).default({ name: "abc" }),
	setup: (options) => {
		const { resolve } = createResolver(import.meta.url);

		const pluginPath = resolve("./plugin.ts");
		console.log({ options, pluginPath });

		return {
			"astro:config:setup": async ({ updateConfig }) => {
				await watchIntegration(resolve());

				addVirtualImport({
					name: "virtual:astro-integration-kit-playground/config",
					content: `export default ${JSON.stringify({ foo: "bar" })}`,
					updateConfig
				});
			},
		};
	},
});

export default testIntegration;
