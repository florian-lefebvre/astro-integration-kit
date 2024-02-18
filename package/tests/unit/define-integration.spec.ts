import type {
	AstroConfig,
	AstroIntegrationLogger,
	HookParameters,
} from "astro";
import { type Mock, afterEach, describe, expect, test, vi } from "vitest";
import { defineIntegration } from "../../src/core/define-integration.js";
import { defineOptions } from "../../src/core/define-options.js";
import type { ExtendedHooks as _ExtendedHooks } from "../../src/core/types.js";
import { corePlugins } from "../../src/plugins/index.js";
import { addDts as mockAddDts } from "../../src/utilities/add-dts.js";
import { addVirtualImport as mockAddVirtualImport } from "../../src/utilities/add-virtual-import.js";
import { addVitePlugin as mockAddVitePlugin } from "../../src/utilities/add-vite-plugin.js";
import { hasIntegration as mockHasIntegration } from "../../src/utilities/has-integration.js";
import { watchIntegration as mockWatchIntegration } from "../../src/utilities/watch-integration.js";

vi.mock("../../src/utils/add-virtual-import.js");
vi.mock("../../src/utils/add-vite-plugin.js");
vi.mock("../../src/utils/add-dts.js");
vi.mock("../../src/utils/has-integration.js");
vi.mock("../../src/utils/watch-integration.js");

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

const plugins = [...corePlugins];

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

		const callArgs = setup.mock.lastCall?.[0];

		expect(callArgs?.name).toBe(name);
	});

	test("Setup should get called with default args", () => {
		const name = "my-integration";
		const defaults = { foo: "bar" };
		const setup = vi.fn(() => {
			return {} as ExtendedHooks;
		});

		defineIntegration({
			name,
			options: defineOptions<{ foo: string }>(defaults),
			setup,
		})();

		const callArgs = setup.mock.lastCall?.[0];

		expect(callArgs?.options).toEqual(defaults);
	});

	test("Setup should get called with overwritten args", () => {
		const name = "my-integration";
		const defaults = { foo: "bar" };
		const setup = vi.fn(() => {
			return {} as ExtendedHooks;
		});

		const expectedOptions = {
			...defaults,
			foo: "baz",
		};

		defineIntegration({
			name,
			options: defineOptions(defaults),
			setup,
		})({
			...expectedOptions,
		});

		const callArgs = setup.mock.lastCall?.[0];

		expect(callArgs?.options).toEqual(expectedOptions);
	});

	test("Integration should have correct name", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return {} as ExtendedHooks;
		});

		const integration = defineIntegration({
			name,
			setup,
		})();

		expect(integration.name).toBe(name);
	});

	describe("astro:config:setup", () => {
		describe("addDts", () => {
			test("Should pass the correct name", () => {
				const name = "my-integration";
				const dtsName = `virtual:${name}`;
				const dtsContent = "declare module {}";

				const setup = (): ExtendedHooks => {
					return {
						"astro:config:setup": ({ addDts }) => {
							addDts({
								name: dtsName,
								content: dtsContent,
							});
						},
					};
				};

				const integration = defineIntegration({
					name,
					plugins,
					setup,
				})();

				const params = astroConfigSetupParamsStub();

				integration.hooks["astro:config:setup"]?.(params);

				const dtsCallArgs = (mockAddDts as Mock).mock.lastCall[0];

				expect(dtsCallArgs.name).toBe(dtsName);
			});

			test("Should pass the correct content", () => {
				const name = "my-integration";
				const dtsName = `virtual:${name}`;
				const dtsContent = "declare module {}";

				const setup = (): ExtendedHooks => {
					return {
						"astro:config:setup": ({ addDts }) => {
							addDts({
								name: dtsName,
								content: dtsContent,
							});
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

				const dtsCallArgs = (mockAddDts as Mock).mock.lastCall[0];

				expect(dtsCallArgs.content).toBe(dtsContent);
			});
		});

		describe("addVirtualImport", () => {
			test("Should pass the correct name", () => {
				const name = "my-integration";
				const virtualImportName = `virtual:${name}`;
				const content = "declare module {}";

				const setup = (): ExtendedHooks => {
					return {
						"astro:config:setup": ({ addVirtualImport }) => {
							addVirtualImport({
								name: virtualImportName,
								content: content,
							});
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

				const addVirtualImportCallArgs = (mockAddVirtualImport as Mock).mock
					.lastCall[0];

				expect(addVirtualImportCallArgs.name).toBe(virtualImportName);
			});

			test("Should pass the correct content", () => {
				const name = "my-integration";
				const virtualImportName = `virtual:${name}`;
				const content = "declare module {}";

				const setup = (): ExtendedHooks => {
					return {
						"astro:config:setup": ({ addVirtualImport }) => {
							addVirtualImport({
								name: virtualImportName,
								content: content,
							});
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

				const addVirtualImportCallArgs = (mockAddVirtualImport as Mock).mock
					.lastCall[0];

				expect(addVirtualImportCallArgs.content).toBe(content);
			});
		});

		describe("addVitePlugin", () => {
			test("Should pass the correct plugin name", () => {
				const name = "my-integration";
				const plugin = {
					name: "vite-plugin-my-integration",
				};

				const setup = (): ExtendedHooks => {
					return {
						"astro:config:setup": ({ addVitePlugin }) => {
							addVitePlugin(plugin);
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

				const addVitePluginCallArgs = (mockAddVitePlugin as Mock).mock
					.lastCall[0];

				expect(addVitePluginCallArgs.plugin.name).toBe(plugin.name);
			});
		});

		describe("hasIntegration", () => {
			test("Should pass the correct name", () => {
				const name = "my-integration";
				const integrationName = "@astrojs/tailwind";

				const setup = (): ExtendedHooks => {
					return {
						"astro:config:setup": ({ hasIntegration }) => {
							hasIntegration(integrationName);
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

				const callArgs = (mockHasIntegration as Mock).mock.lastCall[0];

				expect(callArgs.name).toBe(integrationName);
			});
		});

		describe("watchIntegration", () => {
			test("Should pass the correct name", () => {
				const name = "my-integration";
				const dir = "./src";

				const setup = (): ExtendedHooks => {
					return {
						"astro:config:setup": ({ watchIntegration }) => {
							watchIntegration(dir);
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

				const callArgs = (mockWatchIntegration as Mock).mock.lastCall[0];

				expect(callArgs.dir).toBe(dir);
			});
		});
	});
});
