"use strict";

import sub from "./sub"

const main = function main(arg0) {
    if (arg0) {
        return "main.js";
    }
    return sub();
};

console.log(main());
