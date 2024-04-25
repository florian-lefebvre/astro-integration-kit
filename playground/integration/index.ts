import { readFileSync } from "node:fs";
import { z } from "astro/zod";

import { VitePWA } from "vite-plugin-pwa";

const {
	addDts,
	addVirtualImports,
	addVitePlugin,
	createResolver,
	defineIntegration,
	hasIntegration,
	watchDirectory,
	withPlugins,
} = await import("astro-integration-kit");
const { hasVitePluginPlugin } = await import("astro-integration-kit/plugins");

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
	.optional()
	.default({})
	.refine((val) => val.resource > 1, {
		message: "Must be at least 2 chars long",
		path: ["resource"],
	});

const testIntegration = defineIntegration({
	name: "test-integration",
	optionsSchema,
	setup: ({ name, options }) => {
		const { resolve } = createResolver(import.meta.url);
		options.resource;

		const pluginPath = resolve("./plugin.ts");
		console.log({ options, pluginPath });

		return withPlugins({
			name,
			plugins: [hasVitePluginPlugin],
			hooks: {
				"astro:config:setup": (params) => {
					const { config, updateConfig, hasVitePlugin } = params;
					watchDirectory(params, resolve());

					addDts(params, {
						name: "test-integration",
						content: readFileSync(resolve("./virtual.d.ts"), "utf-8"),
					});

					addDts(params, {
						name: "test-format",
						content: `declare module "test:whatever" {
						interface A {
									foo: bar;
							}
				export const a: A;
					}`,
					});

					console.log(
						"Test hasViteplugin: ",
						hasVitePlugin("vite-plugin-test-integration"),
					);

					addVirtualImports(params, {
						name,
						imports: {
							"virtual:astro-integration-kit-playground/config": `export default ${JSON.stringify(
								{ foo: "bar" },
							)}`,
						},
					});

					console.log(
						"Test hasViteplugin: ",
						hasVitePlugin("vite-plugin-test-integration"),
						hasVitePlugin({ name: "vite-plugin-test-integration" }),
						hasVitePlugin([{ name: "vite-plugin-test-integration" }]),
						hasVitePlugin([[{ name: "vite-plugin-test-integration" }]]),
					);

					// Should log warning about duplicate plugin
					addVitePlugin(params, {
						plugin: { name: "vite-plugin-test-integration" },
					});

					addVitePlugin(params, {
						plugin: VitePWA({ registerType: "autoUpdate" }),
					});

					addVirtualImports(params, {
						name,
						imports: {
							"virtual:playground/simple": `const x = "simple"; export default x;`,
						},
					});
					addVirtualImports(params, {
						name,
						imports: [
							{
								id: "virtual:playground/array-simple",
								content: `const x = "array-simple"; export default x;`,
							},
							{
								id: "virtual:playground/array-complex",
								content: `const x = "array-server"; export default x;`,
								context: "server",
							},
							{
								id: "virtual:playground/array-complex",
								content: `const x = "array-client"; export default x;`,
								context: "client",
							},
						],
					});
					{
						let error = false;
						try {
							addVirtualImports(params, {
								name,
								imports: [
									{
										id: "a",
										content: "",
									},
									{
										id: "a",
										content: "",
										context: "server",
									},
								],
							});
						} catch (err) {
							console.log((err as Error).message);
							error = true;
						}
						if (!error) {
							throw new Error("Should fail");
						}
					}
					{
						let error = false;
						try {
							addVirtualImports(params, {
								name,
								imports: {
									"astro:temp": "export {}",
								},
								__enableCorePowerDoNotUseOrYouWillBeFired: true,
							});
						} catch (err) {
							console.log((err as Error).message);
							error = true;
						}
						if (error) {
							throw new Error("Should not fail");
						}
					}

					if (hasIntegration(params, { name: "@astrojs/tailwind" })) {
						console.log("Tailwind is installed");
					}

					if (
						hasIntegration(params, {
							name: "@astrojs/tailwind",
							position: "before",
							relativeTo: name,
						})
					) {
						console.log("Tailwind is installed before this");
					}

					if (
						hasIntegration(params, {
							name: "integration-a",
							position: "after",
							relativeTo: name,
						})
					) {
						console.log("Integration A is installed after this");
					}

					if (
						hasIntegration(params, {
							name: "integration-a",
							position: "before",
							relativeTo: "integration-b",
						})
					) {
						console.log("Integration A is installed before Integration B");
					}

					if (
						hasIntegration(params, {
							name: "integration-b",
							position: "after",
							relativeTo: "integration-a",
						})
					) {
						console.log("Integration B is installed after Integration A");
					}

					updateConfig({
						vite: {
							optimizeDeps: {
								exclude: ["virtual:@astrojs/vue/app"],
							},
						},
					});

					console.log(
						"VITE PLUGINS",
						config.vite.plugins?.map((p) => p && "name" in p && p.name),
					);

					// Test addVirtualImports disallowed list
					// addVirtualImports({ "astro:test": "export default {}" });

					addVirtualImports(params, {
						name: "whatever",
						imports: [
							{
								id: "whatever-a",
								content: "export const foo = 'bar'",
								context: "server",
							},
							{
								id: "whatever-b",
								content: "export const abc = 'def'",
								context: "server",
							},
							{
								id: "whatever-b",
								content: "export const abc = 'def'",
								context: "client",
							},
						],
					});
				},
			},
		});
	},
});

export default testIntegration;
