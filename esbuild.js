import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const commonOpts = {
  entryPoints: ["./index.js"],
  outdir: "dist",
  bundle: true,
  minify: true,
  treeShaking: true,
  plugins: [nodeExternalsPlugin()],
};

/**
 * build for esm
 */
esbuild.build({
  ...commonOpts,
  format: "esm",
  target: "es2020",
  outExtension: { ".js": ".mjs" },
});

/**
 * build for commonjs
 */
esbuild.build({
  ...commonOpts,
  platform: "node",
  format: "cjs",
  target: "node12",
  outExtension: { ".js": ".cjs" },
});
