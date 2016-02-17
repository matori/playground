"use strict";

var focusableElementsSelectors = [
    "a[href]:not([tabindex='-1'])",
    "area[href]:not([tabindex='-1'])",
    "input:not([disabled]):not([tabindex='-1'])",
    "select:not([disabled]):not([tabindex='-1'])",
    "textarea:not([disabled]):not([tabindex='-1'])",
    "button:not([disabled]):not([tabindex='-1'])",
    "iframe:not([tabindex='-1'])",
    "object:not([tabindex='-1'])",
    "embed:not([tabindex='-1'])",
    "[tabindex]:not([tabindex='-1'])",
    "[contentEditable]:not([tabindex='-1'])"
];

var focusableElementsSelector = focusableElementsSelectors.join(",");

function getFocusableElements(excludeSelector, context) {
    context = context || document;
    var result = [];
    var focusableElements = context.querySelectorAll(focusableElementsSelector);

    for (var i = 0, iz = focusableElements.length; i < iz; i++) {
        var target = focusableElements[i];
        if (target.matches(excludeSelector)) {
            continue;
        }
        result.push(target);
    }

    return result;
}

module.exports = getFocusableElements;
