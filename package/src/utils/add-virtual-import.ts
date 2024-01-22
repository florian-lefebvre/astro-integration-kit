import { type Plugin } from 'vite'
import type { HookParameters } from "astro";

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
	return `\0${id}`
}

function moduleBoilerplate(content: object): string {
    return `
        export default ${ JSON.stringify(content) }
    `
}

function createVirtualModule(name: string, content: string | object): Plugin {
    const pluginName = `vite-plugin-${ name }`
    const virtualModuleName = `virtual:${ name }`

    return {
        name: pluginName,
        resolveId(id): string | void {
            if (id === virtualModuleName) {
                return resolveVirtualModuleId(id)
            }
        },
        load(id): string | void {
            if (id === resolveVirtualModuleId(virtualModuleName)) {
                if (typeof content === 'string') {
                    return content
                }

                // Content is an object an wants to be exported as a default object
                return moduleBoilerplate(content)
            }

        }
    } satisfies Plugin
}

/**
 * This function creates a virtual import that you can use elsewhere in your integration.
 * This is useful for passing things like config options, or overwriting default values.
 * 
 * @param {string} name This is the name of your virtual module. It's final name will be prepended with 'virtual:'.
 * @param {string|object} content The content of your virtual module as a string. Basically just a ts file, but as a string! Or it can be an object, which will be `JSON.stringify`d!
 * @param {HookParameters<'astro:build:setup'>['updateConfig']} updateConfig The `updateConfig` param from the `astro:server:setup` hook.
 * 
 * ---
 * @example
 * ```
 * // myIntegration/index.ts
 * addVirtualImport(
 *   name: 'my-integration/config', // This is the name of your virtual module. It's final name will be prepended with 'virtual:'.
 *   content: {
 *      foo: 'bar',
 *   },
 *   updateConfig,
 * )
 * ```
 * 
 * This is then readable anywhere in your integration:
 * 
 * ```
 * // myIntegration/src/component/layout.astro
 * import { config } from 'virtual:my-integration/config' // This uses the name specified in the 'name' param, but prepended with 'virtual:'.
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
	content: string | object;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}) => {
    try {
        updateConfig({
            vite: {
                plugins: [
                    createVirtualModule(name, content),
                ],
            },
        })
    } catch (e) {
        throw e
    }
}