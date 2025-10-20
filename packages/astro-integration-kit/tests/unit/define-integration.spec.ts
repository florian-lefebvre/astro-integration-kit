import { afterEach, describe, expect, type Mock, test, vi } from "vitest";
import { defineIntegration } from "../../src/core/define-integration.js";

describe("defineIntegration", () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	test("Should run", () => {
		const name = "my-integration";
		const setup = () => ({ hooks: {} });

		expect(() =>
			defineIntegration({
				name,
				setup,
			}),
		).not.toThrow();
	});

	test("Setup should get called", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return { hooks: {} };
		});

		defineIntegration({
			name,
			setup,
		})();

		expect(setup).toBeCalled();
	});

	test("Setup should get called with correct name", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return { hooks: {} };
		});

		defineIntegration({
			name,
			setup,
		})();

		const callArgs = (setup as Mock).mock.lastCall[0];

		expect(callArgs.name).toBe(name);
	});

	test.skip("Setup should get called with default args", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return { hooks: {} };
		});

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
			return { hooks: {} };
		});

		const expectedOptions = {
			foo: "baz",
		};

		defineIntegration({
			name,
			// optionsSchema,
			setup,
			// @ts-expect-error
		})(expectedOptions);

		// const callArgs = setup.mock.lastCall?.[0];
		// expect(callArgs?.options).toEqual(expectedOptions);
	});

	test("Integration should have correct name", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return { hooks: {} };
		});

		const integration = defineIntegration({
			name,
			setup,
		})();

		expect(integration.name).toBe(name);
	});

	test("Integration should have all extra fields from setup", () => {
		const name = "my-integration";
		const setup = vi.fn(() => {
			return {
				hooks: {},
				config: {
					foo: "bar",
				},
			};
		});

		const integration = defineIntegration({
			name,
			setup,
		})();

		expect(integration.config).toStrictEqual({ foo: "bar" });
	});
});
