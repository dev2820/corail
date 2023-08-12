import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { dtsPlugin } from "esbuild-plugin-d.ts";

const commonOpts = {
  entryPoints: ["./src/index.ts"],
  outdir: "dist",
  bundle: true,
  minify: true,
  treeShaking: true,
  plugins: [nodeExternalsPlugin(), dtsPlugin()],
};

/**
 * build for esm
 */
esbuild.build({
  ...commonOpts,
  format: "esm",
  target: "es2020",
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
