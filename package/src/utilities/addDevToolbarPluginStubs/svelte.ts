import Component from "@@COMPONENT_SRC@@";

export default {
    id: "@@ID@@",
    name: "@@NAME@@",
    
    // biome-ignore lint: Using backticks here because most likely copy+pasted svg paths will use double quotes
    icon: `@@ICON@@`,
    init: async canvas => {
        const myWindow = document.createElement("astro-dev-toolbar-window");
        
        canvas.appendChild(myWindow);

		myWindow.insertAdjacentHTML('beforebegin', `<style>@@STYLE@@</style>`);

        const component = new Component({
			target: myWindow,
		});

        (
            (canvas, window)=>{}//@@CALLBACK@@
        )(canvas, myWindow);
    }
}