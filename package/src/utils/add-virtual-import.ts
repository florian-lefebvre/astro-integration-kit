import { type Plugin } from 'vite'
import type { HookParameters } from "astro";

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
	return `\0${id}`
}

function createVirtualModule(name: string, content: string): Plugin {
    const pluginName = `vite-plugin-${ name }`
    const virtualModuleName = `${ name }`

    return {
        name: pluginName,
        resolveId(id): string | void {
            if (id === virtualModuleName) {
                return resolveVirtualModuleId(id)
            }
        },
        load(id): string | void {
            if (id === resolveVirtualModuleId(virtualModuleName)) {
                return content;
            }

        }
    } satisfies Plugin
}

/**
 * This function creates a virtual import that you can use elsewhere in your integration.
 * This is useful for passing things like config options, or overwriting default values.
 * 
 * ---
 * 
 * ```ts
 * // myIntegration/index.ts
 * addVirtualImport(
 *   name: 'virtual:my-integration/config', // This is the name of your virtual module.
 *   content: `
 *      export default ${ JSON.stringify({foo: 'bar'}) },
 *   `,
 *   updateConfig,
 * )
 * ```
 * 
 * This is then readable anywhere in your integration:
 * 
 * ```ts
 * // myIntegration/src/component/layout.astro
 * import { config } from 'virtual:my-integration/config' // This uses the name specified in the 'name' param.
 * 
 * console.log(config.foo) // 'bar'
 * ```
 * 
 * ---
 * 
 * @see https://astro-integration-kit.netlify.app/utilities/add-virtual-import/
 */
export const addVirtualImport = ({
	name,
	content,
	updateConfig,
}: {
	name: string;
	content: string;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}) => {
    updateConfig({
        vite: {
            plugins: [
                createVirtualModule(name, content),
            ],
        },
    })
}