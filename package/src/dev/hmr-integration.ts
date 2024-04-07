import { z } from "astro/zod";
import { defineIntegration } from "../core/define-integration.js";
import { isAbsolute } from "pathe";
import { createResolver } from "../core/create-resolver.js";
import { AstroError } from "astro/errors";
import { watchDirectory } from "../utilities/watch-directory.js";

const getDirectory = async (directory: string) => {
	if (isAbsolute(directory)) {
		return directory;
	}

	const { default: callsites } = await import("callsites");
	const calls = callsites();
	if (!calls[0]) {
		throw new AstroError("TODO:");
	}
	const filename = calls[0].getFileName();
	if (!filename) {
		throw new AstroError("TODO:");
	}
	return createResolver(filename).resolve(directory);
};

export const hmrIntegration = defineIntegration({
	name: "aik/hmr",
	optionsSchema: z.object({
		directory: z.string(),
	}),
	setup({ options }) {
		return {
			"astro:config:setup": async (params) => {
				const directory = await getDirectory(options.directory);
				watchDirectory(params, directory);
			},
		};
	},
});
