module.exports = function (config) {
    config.set({
        basePath: "",
        frameworks: ["mocha", "browserify", "fixture"],
        files: [
            "./src/**/*.js",
            "./test/**/*.spec.js",
            "./test/fixtures/*.html"
        ],
        exclude: [],
        preprocessors: {
            "test/fixtures/*.html": "html2js",
            "test/*.spec.js": "browserify"
        },
        browserify: {
            debug: true,
            transform: [
                "espowerify"
            ]
        },
        reporters: ["mocha"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ["Chrome"],
        singleRun: false,
        concurrency: Infinity
    })
};
