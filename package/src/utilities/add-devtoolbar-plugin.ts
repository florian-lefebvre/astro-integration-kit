import { type HookParameters } from "astro"
import { addVirtualImport } from "./add-virtual-import.js"
import { readFileSync } from 'fs';
import { createResolver } from '../core/create-resolver.js';
import react from '@vitejs/plugin-react'

export type addDevToolbarPluginUserParams = {
    id: string,
    name: string,
    icon: string,
    framework: "react" | "preact" | "vue" | "svelte" | "solid",
    src: string,
}

type addDevToolbarPluginParams = addDevToolbarPluginUserParams & {
    addDevToolbarApp: HookParameters<"astro:config:setup">["addDevToolbarApp"],
    updateConfig: HookParameters<"astro:config:setup">["updateConfig"],
    injectScript: HookParameters<"astro:config:setup">["injectScript"],
}

/**
 * Add a Dev Toolbar Plugin that uses a Framework component.
 *
 * @param {object} params
 * @param {string} params.name - The name of the toolbar plugin
 * @param {string} params.icon - This should be an inline SVG
 * @param {URL} params.framework - Which framework you are using. "react" | "vue" | "preact"
 * @param {URL} params.src - Path to your component
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 * @param {import("astro").HookParameters<"astro:config:setup">["addDevToolbarApp"]} params.addDevToolbarApp
 * @param {import("astro").HookParameters<"astro:config:setup">["injectScript"]} params.injectScript
 *
 * @example
 * ```ts
 * addDevToolbarPlugin({
 *      framework: "vue",
 *      name: "Test Vue Plugin",
 *      id: "test-vue-plugin",
 *      icon: `<svg version="1.1" viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1.3333 0 0 -1.3333 -76.311 313.34)"><g transform="translate(178.06 235.01)"><path d="m0 0-22.669-39.264-22.669 39.264h-75.491l98.16-170.02 98.16 170.02z" fill="#41b883"/></g><g transform="translate(178.06 235.01)"><path d="m0 0-22.669-39.264-22.669 39.264h-36.227l58.896-102.01 58.896 102.01z" fill="#34495e"/></g></g></svg>`,
 *      src: resolve("./Test.vue"),
 * });
 * ```
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-devtoolbar-plugin/
 */
export const addDevToolbarPlugin = ({
    id,
    name,
    icon,
    framework,
    src,
    addDevToolbarApp,
    updateConfig,
    injectScript,
}: addDevToolbarPluginParams) => {
    const virtualModuleName = `virtual:astro-devtoolbar-app-${ id }`;

    const { resolve } = createResolver(import.meta.url);

    let content = readFileSync(resolve(`./addDevToolbarPluginStubs/${ framework }.ts`), 'utf-8');

    content = content
        .replace("@@COMPONENT_SRC@@", src)
        .replace("@@ID@@", id)
        .replace("@@NAME@@", name)
        .replace("@@ICON@@", icon)

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