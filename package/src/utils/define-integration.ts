import type { AstroIntegration } from "astro";
import { defu } from "defu";
import { DEFAULT_HOOKS_NAMES } from "../internal/constants.js";
import { hookContext } from "../internal/context.js";
import { addVitePlugin } from "../vanilla.js";
import { createVirtualModule } from "../utils/add-virtual-import.js"

/**
 * Makes creating integrations easier, and adds a few goodies!
 *
 * @param {object} params
 * @param {string} params.name - The name of your integration
 * @param {object} params.object - Any default config options you want to set
 * @param {function} params.setup - This will be called from your `astro:config:setup` call with the user options
 *
 * @see https://astro-integration-kit.netlify.app/utilities/define-integration/
 *
 * @example
 * ```ts
 * export default defineIntergration({
 *		name: "my-integration",
 *		defaults: {
 *    		foo: "bar",
 * 		},
 * 		setup(options) {
 * 			console.log(options.foo); // "bar"
 * 		}
 * })
 * ```
 */
export const defineIntegration = <
	TOptions extends Record<string, unknown> = never,
>({
	name,
	defaults,
	setup,
}: {
	name: string;
	defaults: {
		[Property in keyof TOptions]-?: TOptions[Property];
	};
	setup: (params: {
		name: string;
		options: TOptions;
	}) => ExtendedHooks;
}): ((options: TOptions) => AstroIntegration) => {
	return (_options) => {
		const options = defu(_options, defaults ?? {}) as TOptions;

		const providedHooks = setup({ name, options });

		const hooks: AstroIntegration["hooks"] = {
			"astro:config:setup"(params) {
				hookContext.callAsync({ "astro:config:setup": params }, () => {
					providedHooks["astro:config:setup"]?.({
						...params,
						addVirtualImport: ({ name, content }) => addVitePlugin({ plugin: createVirtualModule(name, content), updateConfig: params.updateConfig }),
						addVitePlugin: plugin => addVitePlugin({ plugin, updateConfig: params.updateConfig }),
					});
				})
			}
		};

		const otherHooks = DEFAULT_HOOKS_NAMES.filter((hookName): hookName is Exclude<typeof DEFAULT_HOOKS_NAMES[number], "astro:config:setup"> => hookName !== "astro:config:setup");

		for (const hookName of otherHooks) {
			if (providedHooks[hookName] !== undefined) {
				hooks[hookName] = (params) =>
					hookContext.callAsync({ [hookName]: params }, () =>
						// biome-ignore lint/style/noNonNullAssertion: existence checked above
						providedHooks[hookName]!(params as any),
					);
			}
		}

		return {
			name,
			hooks,
		};
	};
};

type Hooks = NonNullable<AstroIntegration["hooks"]>

interface ExtendedHooks extends Omit<Hooks, "astro:config:setup"> {
	"astro:config:setup"?: AddParam<Hooks["astro:config:setup"], { addVitePlugin: AddVitePlugin, addVirtualImport: AddVirtualImport }>;
}

type AddVitePlugin = (plugin: import("vite").Plugin) => void;

type AddVirtualImport = (vimport: { name: string, content: string }) => void;

type AddParam<Func, Param> = Func extends (params: infer Params) => infer ReturnType ? (params: Params & Param) => ReturnType : never;
