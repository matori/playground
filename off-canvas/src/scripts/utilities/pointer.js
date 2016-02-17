"use strict";

var pointerType = require("./pointerType");

var pointerEvents = (function () {
    var nomalizedEvents = ["down", "move", "up", "cancel"];
    var touchEvents = ["touchstart", "touchmove", "touchend", "touchcancel"];
    var MSPointerEvents = ["MSPointerDown", "MSPointerMove", "MSPointerUp", "MSPointerCancel"];
    var pointerEvents = ["pointerdown", "pointermove", "pointerup", "pointercancel"];
    var mouseEvents = ["mousedown", "mousemove", "mouseup", null];

    var supportEvents = null;
    var events = {
        type: null,
        touchable: null,
        name: {}
    };

    if (pointerType.pointer) {
        supportEvents = pointerEvents;
        events.type = "pointer";
        events.touchable = true;
    } else if (pointerType.msPointer) {
        supportEvents = MSPointerEvents;
        events.type = "mspointer";
        events.touchable = true;
    } else if (pointerType.touch) {
        supportEvents = touchEvents;
        events.type = "touch";
        events.touchable = true;
    } else {
        supportEvents = mouseEvents;
        events.type = "mouse";
        events.touchable = false;
    }

    nomalizedEvents.forEach(function (val, idx) {
        events.name[val] = supportEvents[idx];
    });

    return events;
})();

module.exports = pointerEvents;
