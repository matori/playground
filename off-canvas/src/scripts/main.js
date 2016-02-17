"use strict";

require("./polyfills/Element-matches");
require("./polyfills/CustomEvent");
require("./polyfills/requestAnimationFrame");
require("./utilities/throttledResize");

var Nav = require("./modules/Nav");

(function () {
    var navStop;

    var nav = new Nav({
        nav: "#nav",
        openButton: "#openNav",
        closeButton: "#closeNav"
    });

    function toggleNav() {
        if (window.matchMedia("(min-width: 768px)").matches) {
            if (!navStop) {
                nav.stop();
                navStop = true;
            }
        } else {
            if (navStop) {
                nav.start();
                navStop = false;
            }
        }
    }

    window.addEventListener("throttledResize", toggleNav, false);
    toggleNav();

})();
