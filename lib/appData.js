var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/appData.ts
var appData_exports = {};
__export(appData_exports, {
  getAppData: () => getAppData
});
module.exports = __toCommonJS(appData_exports);
var import_path = __toESM(require("path"));

// src/constants.ts
var DEFAULT_OUTDIR = "www";
var DEFAULT_ENTRY_POINT = "src/index.tsx";
var DEFAULT_TEMPLATE = ".moon";

// src/appData.ts
var getAppData = ({ cwd }) => {
  return new Promise((resolve, rejects) => {
    const absSrcPath = import_path.default.resolve(cwd, "src");
    const absPagesPath = import_path.default.resolve(absSrcPath, "pages");
    const absNodeModulesPath = import_path.default.resolve(cwd, "node_modules");
    const absTmpPath = import_path.default.resolve(absNodeModulesPath, DEFAULT_TEMPLATE);
    const absEntryPath = import_path.default.resolve(absTmpPath, DEFAULT_ENTRY_POINT);
    const absOutputPath = import_path.default.resolve(cwd, DEFAULT_OUTDIR);
    const paths = {
      cwd,
      absSrcPath,
      absPagesPath,
      absTmpPath,
      absOutputPath,
      absEntryPath,
      absNodeModulesPath
    };
    const pkg = require(import_path.default.resolve(cwd, "package.json"));
    resolve({ paths, pkg });
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAppData
});
