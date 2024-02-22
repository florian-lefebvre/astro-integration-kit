import Component from "@@COMPONENT_SRC@@";
import { Suspense, createApp, h } from "vue";

export default {
	id: "@@ID@@",
	name: "@@NAME@@",

	// biome-ignore lint/style/noUnusedTemplateLiteral: Using backticks here because most likely copy+pasted svg paths will use double quotes
	icon: `@@ICON@@`,
	init: (canvas) => {
		const renderWindow = document.createElement("astro-dev-toolbar-window");

		canvas.appendChild(renderWindow);

		// biome-ignore lint/style/noUnusedTemplateLiteral: We want to be able to support multiline strings here
		renderWindow.insertAdjacentHTML("beforebegin", `<style>@@STYLE@@</style>`);

		const app = createApp({
			name: "${ virtualModuleName }",
			render() {
				let content = h(Component, {
					canvas,
					renderWindow,
				}, {});

				if (isAsync(Component.setup)) {
					content = h(Suspense, null, content);
				}

				return content;
			},
		});

		app.mount(renderWindow, true);
	},
};

function isAsync(fn) {
	const _constructor = fn?.constructor;
	return _constructor && _constructor.name === "AsyncFunction";
}
