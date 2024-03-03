import type { HookParameters } from 'astro';

export const hasVitePlugin = ({
  name,
  config
}: {
  name: string,
  config: HookParameters<"astro:config:setup">["config"],
}): boolean => {
	const plugins = config.vite?.plugins

	if (plugins) {
		for (const plugin of plugins) {
			if (!plugin) continue
		
			if (Array.isArray(plugin)) {
				return hasVitePlugin({
					name,
					config: {
						vite: {
							plugins: plugin
						}
					} as typeof config
				});
			}
		
			if (plugin instanceof Promise) {
				continue
			}
		
			return name === plugin.name;
		}
	}

	return false;
}
