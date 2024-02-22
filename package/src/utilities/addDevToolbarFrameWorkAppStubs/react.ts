import Component from "@@COMPONENT_SRC@@";
import react, { createElement } from "react";
import { createRoot } from "react-dom/client";

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

		const root = createRoot(renderWindow);

		const componentElement = createElement(Component, {
			canvas,
			renderWindow,
		}, []);

		root.render(componentElement);
	},
};
