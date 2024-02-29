import { readFileSync } from "node:fs";
import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";

const optionsSchema = z
	.object({
		/**
		 * The name of the resource.
		 */
		resource: z
			.string()
			.default("abc")
			.transform((val) => val.length),
	})
	.refine((val) => val.resource > 1, {
		message: "Must be at least 2 chars long",
		path: ["resource"],
	});

const testIntegration = defineIntegration({
	name: "test-integration",
	optionsSchema,
	plugins: [...corePlugins],
	setup: ({ options }) => {
		const { resolve } = createResolver(import.meta.url);
		options.resource;

		const pluginPath = resolve("./plugin.ts");
		console.log({ options, pluginPath });

		return {
			"astro:config:setup": ({
				addVirtualImport,
				watchIntegration,
				hasIntegration,
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

				// Test addVirtualImport disallowed list
				// addVirtualImport({
				// 	name: "astro:test",
				// 	content: "export default {}"
				// });
			},
		};
	},
});

export default testIntegration;
