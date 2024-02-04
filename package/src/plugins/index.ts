import { addDtsPlugin } from "./add-dts.js";

export const corePlugins = [addDtsPlugin] as const;

export { addDtsPlugin };
