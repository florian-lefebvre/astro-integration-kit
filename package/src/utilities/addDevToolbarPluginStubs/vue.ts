import Component from "@@COMPONENT_SRC@@";
import { Suspense, createApp, h } from "vue";

export default {
	id: "@@ID@@",
	name: "@@NAME@@",

	// biome-ignore lint: Using backticks here because most likely copy+pasted svg paths will use double quotes
	icon: `@@ICON@@`,
	init: async (canvas) => {
		const app = createApp({
			name: "${ virtualModuleName }",
			render() {
				let content = h(Component, {}, {});

				if (isAsync(Component.setup)) {
					content = h(Suspense, null, content);
				}

				return content;
			},
		});

		const myWindow = document.createElement("astro-dev-toolbar-window");

		canvas.appendChild(myWindow);

		myWindow.insertAdjacentHTML("beforebegin", "<style>@@STYLE@@</style>");

		app.mount(myWindow, true);

		((canvas, window) => {})(canvas, myWindow); //@@CALLBACK@@
	},
};

function isAsync(fn) {
	const _constructor = fn?.constructor;
	return _constructor && _constructor.name === "AsyncFunction";
}
