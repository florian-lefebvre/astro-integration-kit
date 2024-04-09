import { z } from "astro/zod";
import { defineIntegration } from "../core/define-integration.js";
import { watchDirectory } from "../utilities/watch-directory.js";

export const hmrIntegration = defineIntegration({
	name: "astro-integration-kit/hmr",
	optionsSchema: z.object({
		directory: z.string(),
	}),
	setup({ options }) {
		return {
			"astro:config:setup": (params) => {
				watchDirectory(params, options.directory);
			},
		};
	},
});
