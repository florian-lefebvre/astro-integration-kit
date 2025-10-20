import type {
	AstroConfig,
	AstroIntegrationLogger,
	HookParameters,
} from "astro";
import type { Plugin } from "vite";
import { describe, expect, test, vi } from "vitest";
import { addVitePlugin } from "../../src/utilities/add-vite-plugin.js";

const getParams = () =>
	({
		updateConfig: vi.fn(),
	}) as unknown as HookParameters<"astro:config:setup">;

describe("addVitePlugin", () => {
	test("Should run", () => {
		const params = getParams();

		expect(() =>
			addVitePlugin(params, {
				warnDuplicated: false,
				plugin: null,
			}),
		).not.toThrow();
	});

	test("Should call updateConfig", () => {
		const params = getParams();

		addVitePlugin(params, {
			warnDuplicated: false,
			plugin: null,
		});

		expect(params.updateConfig).toHaveBeenCalled();
	});

	test("Should add vite plugin", () => {
		let plugin: Plugin;
		const pluginName = "test-plugin";

		const updateConfig = vi.fn((config) => {
			plugin = config.vite.plugins[0];
		}) as unknown as HookParameters<"astro:config:setup">["updateConfig"];

		const expectedPlugin = {
			name: pluginName,
		};

		addVitePlugin({ updateConfig } as any, {
			warnDuplicated: false,
			plugin: expectedPlugin,
		});

		// @ts-expect-error
		expect(plugin).toBeDefined();
	});

	test("Plugin name should match", () => {
		let plugin: Plugin;
		const pluginName = "test-plugin";

		const updateConfig = vi.fn((config) => {
			plugin = config.vite.plugins[0];
		}) as unknown as HookParameters<"astro:config:setup">["updateConfig"];

		const expectedPlugin = {
			name: pluginName,
		};

		addVitePlugin({ updateConfig } as any, {
			warnDuplicated: false,
			plugin: expectedPlugin,
		});

		// @ts-expect-error
		expect(plugin.name).toBe(pluginName);
	});

	test("Should log warning if plugin name already exists", () => {
		const plugin = {
			name: "test-plugin",
		};
		const config = {
			vite: {
				plugins: [plugin],
			},
		} as AstroConfig;

		const logger = {
			warn: vi.fn(),
		} as unknown as AstroIntegrationLogger;

		addVitePlugin({ ...getParams(), config, logger } as any, {
			plugin,
		});

		expect(logger.warn).toBeCalled();
	});
});
