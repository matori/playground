"use strict";

require("./polyfills/Element-matches");
require("./polyfills/CustomEvent");
require("./polyfills/requestAnimationFrame");
require("./utilities/throttledResize");

var Nav = require("./modules/Nav");

(function () {
    var isNavStop;

    var nav = new Nav({
        nav: "#nav",
        openButton: "#openNav",
        closeButton: "#closeNav"
    });

    function isLargeScreen() {
        return window.matchMedia("(min-width: 768px)").matches;
    }

    function navStart() {
        nav.start();
        isNavStop = false;
    }

    function navStop() {
        nav.stop();
        isNavStop = true;
    }

    function toggleNav() {
        if (isLargeScreen()) {
            if (!isNavStop) {
                navStop();
            }
        } else {
            if (isNavStop) {
                navStart();
            }
        }
    }

    window.addEventListener("throttledResize", toggleNav, false);
    if (isLargeScreen()) {
        navStop();
    } else {
        navStart();
    }
})();
