import { type HookParameters } from "astro"
import { addVirtualImport } from "./add-virtual-import.js"
import { readFileSync } from "fs";
import { createResolver } from "../core/create-resolver.js";
import react from "@vitejs/plugin-react"

export type addDevToolbarPluginUserParams = {
    id: string,
    name: string,
    icon: string,
    framework: "react" | "preact" | "vue" | "svelte" | "solid",
    src: string,
    style?: string,
    callback?: (canvas: ShadowRoot, window: HTMLElement) => void,
}

export type addDevToolbarPluginParams = addDevToolbarPluginUserParams & {
    addDevToolbarApp: HookParameters<"astro:config:setup">["addDevToolbarApp"],
    updateConfig: HookParameters<"astro:config:setup">["updateConfig"],
    injectScript: HookParameters<"astro:config:setup">["injectScript"],
}

export const addDevToolbarPlugin = ({
    id,
    name,
    icon,
    framework,
    src,
    style,
    callback,
    addDevToolbarApp,
    updateConfig,
    injectScript,
}: addDevToolbarPluginParams) => {
    const virtualModuleName = `virtual:astro-devtoolbar-app-${ id }`;

    const { resolve } = createResolver(import.meta.url);

    let content = readFileSync(resolve(`./addDevToolbarPluginStubs/${ framework }.ts`), 'utf8');

    content = content
        .replace("@@COMPONENT_SRC@@", src)
        .replace("@@ID@@", id)
        .replace("@@NAME@@", name)
        .replace("@@ICON@@", icon)
        .replace("@@STYLE@@", style || "")
        .replace("(canvas, window)=>{}//@@CALLBACK@@", callback?.toString() || "()=>{}")

    addVirtualImport({
        name: virtualModuleName,
        content,
        updateConfig,
    });

    switch (framework) {
        case "react":
            const FAST_REFRESH_PREAMBLE = react.preambleCode;
            const preamble = FAST_REFRESH_PREAMBLE.replace(`__BASE__`, "/");
            injectScript('page', preamble)

            break;
    }

    updateConfig({
        vite: {
            optimizeDeps: {
                exclude: [virtualModuleName],
            }
        }
    })

    addDevToolbarApp(virtualModuleName)
}