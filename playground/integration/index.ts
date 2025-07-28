import { readFileSync } from "node:fs";
import { z } from "astro/zod";
import { importFresh } from "./importFresh";

const { addVirtualImports, createResolver, defineIntegration } =
	await importFresh<typeof import("astro-integration-kit")>(
		"astro-integration-kit",
	);

const optionsSchema = z.object({}).optional();

const playgroundIntegration = defineIntegration({
	name: "playground-integration",
	optionsSchema,
	setup: ({ name }) => {
		const { resolve } = createResolver(import.meta.url);
		return {
			hooks: {
				"astro:config:setup": (params) => {
					params.logger.info("Hello from the playground test-integration!");

					addVirtualImports(params, {
						name,
						imports: {
							"virtual:astro-integration-kit-playground":
								'export const foo = "bar 1"',
						},
					});
				},
				"astro:config:done": ({ injectTypes }) => {
					injectTypes({
						filename: "playground-integration.d.ts",
						content: readFileSync(resolve("./virtual.d.ts"), "utf-8"),
					});
				},
			},
		};
	},
});

export default playgroundIntegration;
