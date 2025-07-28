import type { AstroIntegrationLogger } from "astro";
import { describe, expect, it } from "vitest";
import { definePlugin } from "../../src/core/define-plugin.js";
import { withPlugins } from "../../src/core/with-plugins.js";

describe("withPlugins", () => {
	const fooPlugin = definePlugin({
		name: "foo",
		setup({ name }) {
			let innerState = "initial state";

			return {
				"astro:build:start": ({ logger }) => {
					logger.info(`Called from plugin "foo" on integration "${name}".`);

					return {
						foo: (msg: string) => {
							logger.info(`Calling "foo" with msg: ${msg}`);
						},
						setState: (state: string) => {
							innerState = state;
						},
					};
				},
				"astro:server:done": ({ logger }) => ({
					getState: () => {
						logger.info("Reading state");
						return innerState;
					},
				}),
			};
		},
	});

	const otherFooPlugin = definePlugin({
		name: "foo",
		setup({ name }) {
			return {
				"astro:build:start": ({ logger }) => {
					logger.info(
						`Called from plugin "otherFoo" on integration "${name}".`,
					);

					return {
						foo: (msg: string) => {
							logger.info(`Calling "foo" (from otherFoo) with msg: ${msg}`);
						},
					};
				},
			};
		},
	});

	const barPlugin = definePlugin({
		name: "bar",
		setup({ name }) {
			return {
				"astro:build:start": ({ logger }) => {
					logger.info(`Called from plugin "bar" on integration "${name}".`);

					return {
						foo: (msg: string) => {
							logger.info(`Calling "foo" (from bar) with msg: ${msg}`);
						},
					};
				},
			};
		},
	});

	it("should provide the plugins API to the hooks", () => {
		const integration = withPlugins({
			name: "my-integration",
			plugins: [fooPlugin],
			hooks: {
				"astro:build:start": ({ foo, setState }) => {
					foo("from integration");
					setState("integrationState");
				},
				"astro:server:done": ({ getState }) => {
					expect(getState()).toEqual("integrationState");
				},
			},
		});

		const logger = new MemoryLogger();

		integration.hooks["astro:build:start"]?.({ logger });
		integration.hooks["astro:server:done"]?.({ logger });

		expect(logger.log).toStrictEqual([
			'Called from plugin "foo" on integration "my-integration".',
			'Calling "foo" with msg: from integration',
			"Reading state",
		]);
	});

	it("should override plugins with the same name", () => {
		const integration = withPlugins({
			name: "my-integration",
			plugins: [fooPlugin, otherFooPlugin],
			hooks: {
				"astro:build:start": ({ foo }) => {
					foo("from integration");
				},
			},
		});

		const logger = new MemoryLogger();

		integration.hooks["astro:build:start"]?.({ logger });

		expect(logger.log).toStrictEqual([
			'Called from plugin "otherFoo" on integration "my-integration".',
			'Calling "foo" (from otherFoo) with msg: from integration',
		]);
	});

	it("should override plugin APIs with the same name", () => {
		const integration = withPlugins({
			name: "my-integration",
			plugins: [fooPlugin, barPlugin],
			hooks: {
				"astro:build:start": ({ foo }) => {
					foo("from integration");
				},
			},
		});

		const logger = new MemoryLogger();

		integration.hooks["astro:build:start"]?.({ logger });

		expect(logger.log).toStrictEqual([
			'Called from plugin "foo" on integration "my-integration".',
			'Called from plugin "bar" on integration "my-integration".',
			'Calling "foo" (from bar) with msg: from integration',
		]);
	});

	it("should run plugin hooks that are not part of the integration", () => {
		const integration = withPlugins({
			name: "my-integration",
			plugins: [fooPlugin],
			hooks: {
				"astro:server:done": ({ getState }) => {
					expect(getState()).toEqual("initial state");
				},
			},
		});

		const logger = new MemoryLogger();

		integration.hooks["astro:build:start"]?.({ logger });
		integration.hooks["astro:server:done"]?.({ logger });

		expect(logger.log).toStrictEqual([
			'Called from plugin "foo" on integration "my-integration".',
			"Reading state",
		]);
	});
});

class MemoryLogger implements AstroIntegrationLogger {
	log: string[] = [];

	options = {} as any;
	label = "";

	fork(): AstroIntegrationLogger {
		return this;
	}

	info(message: string): void {
		this.log.push(message);
	}
	warn(message: string): void {
		this.log.push(message);
	}
	error(message: string): void {
		this.log.push(message);
	}
	debug(message: string): void {
		this.log.push(message);
	}
}
