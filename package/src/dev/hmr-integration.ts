import { z } from "astro/zod";
import { defineIntegration } from "../core/define-integration.js";
import { watchDirectory } from "../utilities/watch-directory.js";

export const hmrIntegration = defineIntegration({
	name: "astro-integration-kit/hmr",
	optionsSchema: z.union([
		z.object({
			directory: z.string(),
		}),
		z.object({
			directories: z.array(z.string()),
		}),
	]),
	setup({ options }) {
		return {
			hooks: {
				"astro:config:setup": (params) => {
					if ('directories' in options) {
						for (const directory of options.directories) {
							watchDirectory(params, directory);
						}
					} else {
						watchDirectory(params, options.directory);
					}
				},
			},
		};
	},
});
