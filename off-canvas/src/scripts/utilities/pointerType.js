"use strict";

var pointerEnabled = ("PointerEvent" in window);

var pointerType = Object.freeze({
    pointer: pointerEnabled,
    msPointer: "MSPointerEvent" in window && !pointerEnabled,
    touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
});

module.exports = pointerType;
