import type {
	AstroConfig,
	AstroIntegrationLogger,
	HookParameters,
} from "astro";
import { type Mock, afterEach, describe, expect, test, vi } from "vitest";
import { defineIntegration } from "../../src/core/define-integration.js";
import type { ExtendedHooks as _ExtendedHooks } from "../../src/core/types.js";
import { hasVitePluginPlugin } from "../../src/plugins/index.js";
import { hasVitePlugin as mockHasVitePlugin } from "../../src/utilities/has-vite-plugin.js";

vi.mock("../../src/utilities/has-vite-plugin.js");

const astroConfigSetupParamsStub = (
	params?: HookParameters<"astro:config:setup">,
): HookParameters<"astro:config:setup"> => ({
	logger: vi.fn() as unknown as AstroIntegrationLogger,
	addClientDirective: vi.fn(),
	addDevToolbarApp: vi.fn(),
	addMiddleware: vi.fn(),
	addRenderer: vi.fn(),
	addWatchFile: vi.fn(),
	command: "dev",
	injectRoute: vi.fn(),
	injectScript: vi.fn(),
	isRestart: false,
	updateConfig: vi.fn(),
	addDevOverlayPlugin: vi.fn(),
	config: {} as unknown as AstroConfig,
	...(params || {}),
});

const plugins = [hasVitePluginPlugin];

type ExtendedHooks = _ExtendedHooks<typeof plugins>;

describe("defineIntegration", () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	test("Should run", () => {
		const name = "my-integration";
		const setup = () => ({});

		expect(() =>
			defineIntegration({
				name,
				plugins,
				setup,
			}),
		).not.toThrow();
	});

	test("Setup should get called", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return {} as ExtendedHooks;
		});

		defineIntegration({
			name,
			plugins,
			setup,
		})();

		expect(setup).toBeCalled();
	});

	test("Setup should get called with correct name", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return {} as ExtendedHooks;
		});

		defineIntegration({
			name,
			plugins,
			setup,
		})();

		const callArgs = (setup as Mock).mock.lastCall[0];

		expect(callArgs.name).toBe(name);
	});

	test.skip("Setup should get called with default args", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return {} as ExtendedHooks;
		}) as any;

		defineIntegration({
			name,
			// optionsSchema,
			setup,
		})();

		// const callArgs = setup.mock.lastCall?.[0];
		// expect(callArgs?.options).toEqual(defaults);
	});

	test.skip("Setup should get called with overwritten args", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return {} as ExtendedHooks;
		}) as any;

		const expectedOptions = {
			foo: "baz",
		};

		defineIntegration({
			name,
			// optionsSchema,
			setup,
			// @ts-ignore
		})(expectedOptions);

		// const callArgs = setup.mock.lastCall?.[0];
		// expect(callArgs?.options).toEqual(expectedOptions);
	});

	test("Integration should have correct name", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return {} as ExtendedHooks;
		}) as any;

		const integration = defineIntegration({
			name,
			setup,
		})();

		expect(integration.name).toBe(name);
	});

	describe("astro:config:setup", () => {
		describe("hasVitePlugin", () => {
			test("Should pass the correct plugin name", () => {
				const name = "my-integration";
				const plugin = {
					name: "vite-plugin-my-integration",
				};

				const setup = (): ExtendedHooks => {
					return {
						"astro:config:setup": ({ hasVitePlugin }) => {
							hasVitePlugin(plugin);
						},
					};
				};

				const integration = defineIntegration({
					name,
					setup,
					plugins,
				})();

				const params = astroConfigSetupParamsStub();

				integration.hooks["astro:config:setup"]?.(params);

				const hasVitePluginCallArgs = (mockHasVitePlugin as Mock).mock
					.lastCall[1];

				expect(hasVitePluginCallArgs.plugin.name).toBe(plugin.name);
			});
		});
	});
});
