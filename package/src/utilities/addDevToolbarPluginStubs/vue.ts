import { h, createApp, Suspense } from "vue";
import Component from "@@COMPONENT_SRC@@";

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
            }
        });

        const myWindow = document.createElement("astro-dev-toolbar-window");

        canvas.appendChild(myWindow);
        
        app.mount(myWindow, true)
    }
}

function isAsync(fn) {
    const constructor = fn?.constructor;
    return constructor && constructor.name === "AsyncFunction";
}