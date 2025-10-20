import { assertType, expectTypeOf, test } from "vitest";
import { definePlugin } from "../../src/core/define-plugin.js";
import { withPlugins } from "../../src/core/with-plugins.js";

const testPluginA = definePlugin({
	name: "extraCallback",
	setup: ({ name }) => {
		expectTypeOf(name).toBeString();

		return {
			"astro:config:setup": () => ({
				oneCallback: (foo: string): string => foo,
				anotherCallback: (foo: number): number => foo,
			}),
		};
	},
});

test("Plugin extends hooks", () => {
	withPlugins({
		name: "test-integration",
		plugins: [testPluginA],
		hooks: {
			"astro:config:setup": (params) => {
				expectTypeOf(params.oneCallback).toMatchTypeOf<
					(foo: string) => string
				>();
				expectTypeOf(params.anotherCallback).toMatchTypeOf<
					(foo: number) => number
				>();
			},
			"astro:build:ssr": (params) => {
				// @ts-expect-error extraCallback is not defined in this hook
				assertType(params.oneCallback);
				// @ts-expect-error extraCallback is not defined in this hook
				assertType(params.anotherCallback);
			},
		},
	});
});

test("Plugin override", () => {
	const plugin = definePlugin({
		name: "alternativeCallbacks",
		setup: ({ name }) => {
			expectTypeOf(name).toBeString();

			return {
				"astro:config:setup": () => ({
					oneCallback: (foo: number, bar: boolean) => ({ foo, bar }),
				}),
			};
		},
	});

	withPlugins({
		name: "test-integration",
		plugins: [testPluginA, plugin],
		hooks: {
			"astro:config:setup": (params) => {
				expectTypeOf(params.oneCallback).not.toMatchTypeOf<
					(foo: string) => string
				>();
				expectTypeOf(params.oneCallback).toMatchTypeOf<
					(foo: number, bar: boolean) => { foo: number; bar: boolean }
				>();
				expectTypeOf(params.anotherCallback).toMatchTypeOf<
					(foo: number) => number
				>();
			},
			"astro:build:ssr": (params) => {
				// @ts-expect-error extraCallback is not defined in this hook
				assertType(params.oneCallback);
				// @ts-expect-error extraCallback is not defined in this hook
				assertType(params.anotherCallback);
			},
		},
	});
});
