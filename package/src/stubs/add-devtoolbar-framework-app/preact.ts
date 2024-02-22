import Component from "@@COMPONENT_SRC@@";
import { h, render } from "preact";

export default {
	id: "@@ID@@",
	name: "@@NAME@@",

	icon: `@@ICON@@`,
	init: (canvas) => {
		const renderWindow = document.createElement("astro-dev-toolbar-window");

		canvas.appendChild(renderWindow);

		renderWindow.insertAdjacentHTML("beforebegin", `<style>@@STYLE@@</style>`);

		render(h(Component, {
			canvas,
			renderWindow,
		}, []), renderWindow);
	},
};
