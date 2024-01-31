import { describe, expect, test, vi } from "vitest";
import { defineIntegration } from '../../src/utils/define-integration.js';
import type { ExtendedHooks } from '../../src/types.js';

describe("defineIntegration", () => {
    test("Should run", () => {
        const name = 'my-integration';
        const setup = () => ({} as ExtendedHooks)

        expect(() => defineIntegration({
            name,
            setup,
        })).not.toThrow()
    })

    test("Setup should get called", () => {
        const name = 'my-integration';
        const defaults = {foo: 'bar'};
        const setup = vi.fn(() => {
            return {} as ExtendedHooks;
        })

        defineIntegration({
            name,
            defaults,
            setup,
        })({...defaults});

        expect(setup).toBeCalled();
    });

    test("Setup should get called with correct name", () => {
        const name = 'my-integration';
        const defaults = {foo: 'bar'};
        const setup = vi.fn(() => {
            return {} as ExtendedHooks;
        })

        defineIntegration({
            name,
            defaults,
            setup,
        })({...defaults});

        const callArgs = setup.mock.lastCall?.[0];

        expect(callArgs?.name).toBe(name); 
    });

    test("Setup should get called with default args", () => {
        const name = 'my-integration';
        const defaults = {foo: 'bar'};
        const setup = vi.fn(() => {
            return {} as ExtendedHooks;
        })

        defineIntegration({
            name,
            defaults,
            setup,
        })({});

        const callArgs = setup.mock.lastCall?.[0];

        console.log(callArgs)

        expect(callArgs?.options).toEqual(defaults); 
    });

    test("Setup should get called with overwritten args", () => {
        const name = 'my-integration';
        const defaults = {foo: 'bar'};
        const setup = vi.fn(() => {
            return {} as ExtendedHooks;
        })

        const expectedOptions = {
            ...defaults,
            foo: 'baz',
        }

        defineIntegration({
            name,
            defaults,
            setup,
        })({
            ...expectedOptions,
        });

        const callArgs = setup.mock.lastCall?.[0];

        console.log(callArgs)

        expect(callArgs?.options).toEqual(expectedOptions); 
    });

    test("Integration should have correct name", () => {
        const name = 'my-integration';
        const setup = vi.fn(() => {
            return {} as ExtendedHooks;
        })


        const integration = defineIntegration({
            name,
            setup,
        })({});

        expect(integration.name).toBe(name);
    });
});
