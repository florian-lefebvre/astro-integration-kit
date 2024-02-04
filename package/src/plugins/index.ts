import { addDtsPlugin } from "./add-dts.js";
import { addVirtualImportPlugin } from "./add-virtual-import.js";

export const corePlugins = [addDtsPlugin, addVirtualImportPlugin] as const;

export { addDtsPlugin, addVirtualImportPlugin };
