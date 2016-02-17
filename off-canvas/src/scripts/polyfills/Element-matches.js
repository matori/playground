"use strict";

module.exports = (function () {
    var vendors = ["ms", "moz", "webkit", "o"];
    if (window.Element && !window.Element.prototype.matches) {
        var proto = window.Element.prototype;
        proto.matches = proto.matchesSelector;
        for (var i = 0, iz = vendors.length; i < iz && !proto.matches; ++i) {
            proto.matches = proto[vendors[i] + "MatchesSelector"];
        }
    }
})();
