import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import autoPreprocess from "svelte-preprocess";
import image from "svelte-image";
import copy from 'rollup-plugin-copy';
import { env } from "process";

export default {
    input: "src/main.ts",
    output: {
        format: "cjs",
        file: "main.js",
        exports: "default",
    },
    external: ["obsidian", "fs", "os", "path"],
    plugins: [
        svelte({
            emitCss: false,
            preprocess: autoPreprocess(),
            preprocess: {
                ...image(),
            }
        }),
        typescript({ sourceMap: env.env === "DEV" }),
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs({
            include: "node_modules/**",
        }),
        copy({
            targets: [{ src: 'static/g', dest: 'public' }],
        }),
    ],
};