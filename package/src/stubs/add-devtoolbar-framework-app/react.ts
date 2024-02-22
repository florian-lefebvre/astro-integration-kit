import Component from "@@COMPONENT_SRC@@";
import react, { createElement } from "react";
import { createRoot } from "react-dom/client";

export default {
	id: "@@ID@@",
	name: "@@NAME@@",

	icon: `@@ICON@@`,
	init: (canvas) => {
		const renderWindow = document.createElement("astro-dev-toolbar-window");

		canvas.appendChild(renderWindow);

		renderWindow.insertAdjacentHTML("beforebegin", `<style>@@STYLE@@</style>`);

		const root = createRoot(renderWindow);

		const componentElement = createElement(Component, {
			canvas,
			renderWindow,
		}, []);

		root.render(componentElement);
	},
};
