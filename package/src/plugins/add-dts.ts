import { definePlugin } from "../core";
import { addDts } from "../utilities";

export const addDtsPlugin = definePlugin({
	name: "addDts",
	hook: "astro:config:setup",
	implementation:
		({ logger, config: { root, srcDir } }) =>
		({ name, content }: { name: string; content: string }) =>
			addDts({ name, content, logger, root, srcDir }),
});
