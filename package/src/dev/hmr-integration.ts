import { z } from "astro/zod";
import { defineIntegration } from "../core/define-integration.js";

export const hmrIntegration = defineIntegration({
	name: "aik/hmr",
	optionsSchema: z.object({
		directory: z.string(),
	}),
	setup({ options }) {
		return {};
	},
});
