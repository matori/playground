"use strict";

const path = require("path");
const fs = require("fs-extra");
const jade = require("jade");
const sass = require("node-sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const browserify = require("browserify");
const watchify = require("watchify");
const bs = require("browser-sync").create();

const srcDir = "./src";
const distDir = "./_build";

const b = browserify({
    entries: [`${srcDir}/scripts/main.js`],
    cache: {},
    packageCache: {},
    debug: true,
    plugin: [watchify]
});

function bundle() {
    b.bundle().pipe(fs.createOutputStream(`${distDir}/scripts/main.js`));
}

function logMessage(msg) {
    console.log(`Watchify: ${msg}`);
}

function cssPostProcess(sassResult) {
    postcss([
        autoprefixer({browsers: ["last 1 versions", "ios > 7", "android > 4.1"]})
    ]).process(sassResult.css, {
        map: {
            inline: true,
            prev: sassResult.map.toString()
        }
    }).then(function (result) {
        fs.outputFile(`${distDir}/styles/main.css`, result.css);
    });
}

function sassCompile() {
    sass.render({
        file: `${srcDir}/styles/main.scss`,
        outFile: `${distDir}/styles/main.css`,
        outputStyle: "expanded",
        sourceMap: true
    }, (error, result) => {
        if (error) {
            console.log(error.status);
            console.log(error.column);
            console.log(error.message);
            console.log(error.line);
        } else {
            cssPostProcess(result);
        }
    });
}

function jadeCompile() {
    var compile = jade.compileFile(`${srcDir}/markup/index.jade`, {cache: false, pretty: true});
    var jadeData = {};
    var html = compile(jadeData);
    fs.outputFile(`${distDir}/index.html`, html);
}

b.on("update", bundle);
b.on("log", logMessage);

fs.watch(`${srcDir}/styles`, {recursive: true}, (evt, filename) => {
    var extname = path.extname(filename);
    if (/^\.s[ac]ss$/i.test(extname)) {
        console.log(filename + " changed");
        sassCompile();
    }
});

fs.watch(`${srcDir}/markup`, {recursive: true}, (evt, filename) => {
    var extname = path.extname(filename);
    if (extname === ".jade" || extname === ".json") {
        jadeCompile();
        console.log(`${filename} changed`);
    }
});

bs.watch([`${distDir}/**/*`, `!${distDir}/**/.*`], (evt, filename) => {
    if (evt === "change") {
        bs.reload();
    }
});

bs.init({
    server: distDir,
    port: 8000,
    browser: "google chrome",
    ui: false,
    ghostMode: false,
    reloadDebounce: 100
});

bundle();
sassCompile();
jadeCompile();
