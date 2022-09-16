import typescript from "@rollup/plugin-typescript"

export default {
    input: "./index.ts",
    output: [
        //1. cjs commonjs
        //2. esm
        {
            format: "cjs",
            file: "lib/guid-mini-vue.cjs.js"
        },
        {
            format: "es",
            file: "lib/guid-mini-vue.es.js"
        }
    ],
    plugins: [
        typescript()
    ]
}