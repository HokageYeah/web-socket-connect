import path from "node:path";
import fs from "node:fs";
import type { OutputOptions, RollupOptions } from "rollup";

const packageDir = path.resolve(__dirname, "../packages");
const packageFiles = fs.readdirSync(packageDir);
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import { uglify } from "rollup-plugin-uglify";
import nodeResolve from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import { terser } from "rollup-plugin-terser";

const esbuildPlugin = esbuild({ target: "esnext" });
const terserPlugin = terser({
  compress: {
    drop_console: true, // 移除 console.log 语句
    drop_debugger: true, // 移除 debugger 语句
  },
});

console.log(packageDir);
console.log(packageFiles);
console.log("-------------uglify", uglify);

const options = (path: string) => {
  return [
    {
      input: [`./packages/${path}/index.ts`],
      output: [
        {
          file: `./packages/${path}/dist/index.cjs`,
          format: "cjs",
          sourcemap: true,
        },
        {
          file: `./packages/${path}/dist/index.mjs`,
          format: "esm",
          sourcemap: true,
        },
        {
          file: `./packages/${path}/dist/index.js`,
          format: "umd",
          name: "web-socket-connect",
          sourcemap: true,
        },
        {
          file: `./packages/${path}/dist/index.min.js`,
          format: "umd",
          name: "web-socket-connect",
          sourcemap: true,
          plugins: [uglify()],
        },
      ],
      plugins: [
        // typescript({
        //   tsconfigOverride: {
        //     compilerOptions: {
        //       module: "ESNext",
        //     },
        //   },
        //   useTsconfigDeclarationDir: true,
        // }),
        resolve(),
        commonjs(),
        nodeResolve(),
        json(),
        esbuildPlugin,
        // terserPlugin
      ],
    },
    {
      input: `./packages/${path}/index.ts`,
      output: [
        { file: `./packages/${path}/dist/index.cjs.d.ts`, format: "cjs" },
        { file: `./packages/${path}/dist/index.esm.d.ts`, format: "esm" },
        { file: `./packages/${path}/dist/index.d.ts`, format: "umd" },
        { file: `./packages/${path}/dist/index.min.d.ts`, format: "umd" },
      ],
      plugins: [dts()],
    },
  ];
};

let configs: any[] = [];
configs = packageFiles.map((pathName) => options(pathName)).flat();
console.log("查看----", configs);

export default configs;
