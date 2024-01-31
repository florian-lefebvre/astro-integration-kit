import { describe, expect, test, beforeAll, afterAll, vi } from "vitest";
import { addDts } from '../../src/utils/add-dts.js';
import { dirname } from 'pathe';
import { fileURLToPath } from 'url';
import { createResolver } from '../../src/utils/create-resolver.js';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';

const tempFolderName = '.TMP_ADDDTS/'
const { resolve } = createResolver(import.meta.url)
const { resolve: tempFolderResolver } = createResolver(resolve(tempFolderName))
const envDtsPath = resolve(`${ tempFolderName }/env.d.ts`)

const createTempFiles = () => {
    mkdirSync(resolve(tempFolderName))

    writeFileSync(envDtsPath, `/// <reference types="astro/client" />`, {
        encoding: 'utf-8',
    })
}

const deleteTempFiles = () => {
    rmSync(resolve(tempFolderName), {
        recursive: true,
        force: true,
    })
}

describe("addDts", () => {
    beforeAll(() => {
        createTempFiles()
    })

    afterAll(() => {
        deleteTempFiles()
    })

    test("Should run", () => {
        const dtsFileName = 'TEST';
        const dtsFileContent = "declare module \"my-integration\" {}";
        const root =  new URL(tempFolderName, import.meta.url);
        const srcDir = new URL(tempFolderName, import.meta.url);
        const logger = {
            info: vi.fn(),
        } as any;

        expect(() => addDts({
            name: dtsFileName,
            content: dtsFileContent,
            logger,
            root,
            srcDir,
        })).not.toThrow()
    })

    test("Should update the env.d.ts (double quotes)", () => {
        const dtsFileName = 'TEST';
        const dtsFileContent = "declare module \"my-integration\" {}";
        const root =  new URL(tempFolderName, import.meta.url);
        const srcDir = new URL(tempFolderName, import.meta.url);
        const logger = {
            info: vi.fn(),
        } as any;

        const expectedEnvDtsContent = `/// <reference types="astro/client" />\n/// <reference types=".astro/${ dtsFileName }.d.ts" />`

        addDts({
            name: dtsFileName,
            content: dtsFileContent,
            logger,
            root,
            srcDir,
        });

        const fileContents = readFileSync(envDtsPath, {
            encoding: 'utf-8'
        })

        expect(fileContents).toEqual(expectedEnvDtsContent)
    })

    test("Should update the env.d.ts (single quotes)", () => {
        const dtsFileName = 'TEST';
        const dtsFileContent = "declare module \"my-integration\" {}";
        const root =  new URL(tempFolderName, import.meta.url);
        const srcDir = new URL(tempFolderName, import.meta.url);
        const logger = {
            info: vi.fn(),
        } as any;

        const expectedEnvDtsContent = `/// <reference types='astro/client' />\n/// <reference types='.astro/${ dtsFileName }.d.ts' />`

        writeFileSync(envDtsPath, `/// <reference types='astro/client' />`, {
            encoding: 'utf-8',
        })

        addDts({
            name: dtsFileName,
            content: dtsFileContent,
            logger,
            root,
            srcDir,
        });

        const fileContents = readFileSync(envDtsPath, {
            encoding: 'utf-8'
        });

        expect(fileContents).toEqual(expectedEnvDtsContent);
    });

    test("Should create the virtual file", () => {
        const dtsFileName = 'TEST';
        const dtsFileContent = "declare module \"my-integration\" {}";
        const root =  new URL(tempFolderName, import.meta.url);
        const srcDir = new URL(tempFolderName, import.meta.url);
        const logger = {
            info: vi.fn(),
        } as any;

        addDts({
            name: dtsFileName,
            content: dtsFileContent,
            logger,
            root,
            srcDir,
        });

        const fileContents = readFileSync(tempFolderResolver(`.astro/${ dtsFileName }.d.ts`), {
            encoding: 'utf-8'
        });

        expect(fileContents).toEqual(dtsFileContent);
    });
});
