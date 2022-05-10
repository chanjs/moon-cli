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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/styles.ts
var styles_exports = {};
__export(styles_exports, {
  style: () => style
});
module.exports = __toCommonJS(styles_exports);
var import_esbuild = __toESM(require("esbuild"));
var import_path = __toESM(require("path"));
function style() {
  return {
    name: "style",
    setup({ onResolve, onLoad }) {
      const cwd = process.cwd();
      onResolve({ filter: /\.css$/, namespace: "file" }, (args) => {
        const absPath = import_path.default.resolve(cwd, import_path.default.relative(cwd, args.resolveDir), args.path);
        return { path: absPath, namespace: "style-stub" };
      });
      onResolve({ filter: /\.css$/, namespace: "style-stub" }, (args) => {
        return { path: args.path, namespace: "style-content" };
      });
      onResolve({ filter: /^__style_helper__$/, namespace: "style-stub" }, (args) => ({
        path: args.path,
        namespace: "style-helper",
        sideEffects: false
      }));
      onLoad({ filter: /.*/, namespace: "style-helper" }, () => __async(this, null, function* () {
        return {
          contents: `
              export function injectStyle(text) {
                if (typeof document !== 'undefined') {
                  var style = document.createElement('style')
                  var node = document.createTextNode(text)
                  style.appendChild(node)
                  document.head.appendChild(style)
                }
              }
            `
        };
      }));
      onLoad({ filter: /.*/, namespace: "style-stub" }, (args) => __async(this, null, function* () {
        return {
          contents: `
              import { injectStyle } from "__style_helper__"
              import css from ${JSON.stringify(args.path)}
              injectStyle(css)
            `
        };
      }));
      onLoad({
        filter: /.*/,
        namespace: "style-content"
      }, (args) => __async(this, null, function* () {
        const { errors, warnings, outputFiles } = yield import_esbuild.default.build({
          entryPoints: [args.path],
          logLevel: "silent",
          bundle: true,
          write: false,
          charset: "utf8",
          minify: true,
          loader: {
            ".svg": "dataurl",
            ".ttf": "dataurl"
          }
        });
        return {
          errors,
          warnings,
          contents: outputFiles[0].text,
          loader: "text"
        };
      }));
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  style
});
