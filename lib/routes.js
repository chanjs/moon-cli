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

// src/routes.ts
var routes_exports = {};
__export(routes_exports, {
  getRoutes: () => getRoutes
});
module.exports = __toCommonJS(routes_exports);
var import_fs = require("fs");
var import_path = __toESM(require("path"));

// src/constants.ts
var DEFAULT_GLOBAL_LAYOUTS = "top/index.tsx";

// src/routes.ts
var getFiles = (root) => {
  if (!(0, import_fs.existsSync)(root))
    return [];
  return (0, import_fs.readdirSync)(root).filter((file) => {
    const absFile = import_path.default.join(root, file);
    const fileStat = (0, import_fs.statSync)(absFile);
    const isFile = fileStat.isFile();
    if (isFile) {
      if (!/\.tsx?$/.test(file))
        return false;
    }
    return true;
  });
};
var filesToRoutes = (files, pagesPath) => {
  return files.map((i) => {
    let pagePath = import_path.default.basename(i, import_path.default.extname(i));
    const element = import_path.default.resolve(pagesPath, pagePath);
    if (pagePath === "home")
      pagePath = "";
    return {
      path: `/${pagePath}`,
      element
    };
  });
};
var getRoutes = ({ appData }) => {
  return new Promise((resolve) => {
    const files = getFiles(appData.paths.absPagesPath);
    const routes = filesToRoutes(files, appData.paths.absPagesPath);
    const layoutPath = import_path.default.resolve(appData.paths.absSrcPath, DEFAULT_GLOBAL_LAYOUTS);
    if (!(0, import_fs.existsSync)(layoutPath)) {
      resolve(routes);
    } else {
      resolve([{
        path: "/",
        element: layoutPath.replace(import_path.default.extname(layoutPath), ""),
        routes
      }]);
    }
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRoutes
});
