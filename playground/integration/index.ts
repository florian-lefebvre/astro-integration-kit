import type { AstroIntegration } from "astro";
import {
	createResolver,
	watchIntegration,
	addVirtualImport
} from "astro-integration-kit";

const testIntegration = (): AstroIntegration => {
	const { resolve } = createResolver(import.meta.url);

	const pluginPath = resolve("./plugin.ts");
	console.log({ pluginPath });

	return {
		name: "test-integration",
		hooks: {
			"astro:config:setup": async ({ addWatchFile, command, updateConfig }) => {
				await watchIntegration({
					addWatchFile,
					command,
					dir: resolve(),
					updateConfig,
				});

				addVirtualImport({
					name: 'astro-integration-kit-playground/config',
					content: {
						foo: 'bar',
					},
					updateConfig,
				});
			},
		},
	};
};

export default testIntegration;
