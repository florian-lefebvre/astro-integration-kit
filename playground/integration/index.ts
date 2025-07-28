import { readFileSync } from "node:fs";
import type {
	addVirtualImports as AddVirtualImports,
	createResolver as CreateResolver,
	defineIntegration as DefineIntegration,
} from "astro-integration-kit";
import { z } from "astro/zod";
import { importFresh } from "./importFresh";

const { addVirtualImports, createResolver, defineIntegration } =
	(await importFresh("astro-integration-kit")) as {
		addVirtualImports: typeof AddVirtualImports;
		createResolver: typeof CreateResolver;
		defineIntegration: typeof DefineIntegration;
	};

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
