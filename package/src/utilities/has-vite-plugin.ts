import type { HookParameters } from 'astro';

export const hasVitePlugin = ({
  name,
  config
}: {
  name: string
  config: HookParameters<"astro:config:setup">["config"],
}) => {
	return (config.vite?.plugins || []).some(plugin => {
		if (!plugin) return false;

		if (Array.isArray(plugin)) {
			return hasVitePlugin({ name, config });
		}

		if (plugin instanceof Promise) {
			return false;
		}

		return plugin.name === name;
	});
}
