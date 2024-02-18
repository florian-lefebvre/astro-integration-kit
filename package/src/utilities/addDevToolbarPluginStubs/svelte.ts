import Component from "@@COMPONENT_SRC@@";

export default {
	id: "@@ID@@",
	name: "@@NAME@@",

	// biome-ignore lint/style/noUnusedTemplateLiteral: Using backticks here because most likely copy+pasted svg paths will use double quotes
	icon: `@@ICON@@`,
	init: async (canvas) => {
		const myWindow = document.createElement("astro-dev-toolbar-window");

		canvas.appendChild(myWindow);

		// biome-ignore lint/style/noUnusedTemplateLiteral: We want to be able to support multiline strings here
		myWindow.insertAdjacentHTML("beforebegin", `<style>@@STYLE@@</style>`);

		const component = new Component({
			target: myWindow,
		});

		((canvas, window) => {})(canvas, myWindow); //@@CALLBACK@@
	},
};
