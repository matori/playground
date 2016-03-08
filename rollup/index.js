"use strict";

const rollup = require("rollup");
const babel = require("rollup-plugin-babel");

rollup.rollup({
    entry: "src/main.js",
    plugins: [
        babel({
            exclude: "node_modules/**"
        })
    ]
}).then((bundle) => {
    bundle.write({
        format: "cjs",
        dest: "_build/main.js"
    });
});
