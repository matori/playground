"use strict";

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function transAnimName() {
    var docStyle = document.documentElement.style;
    var result = {
        properties: {
            transform: "transform",
            transition: "transition",
            animation: "animation"
        },
        events: {
            transition: {
                end: "transitionend"
            },
            animation: {
                start: "animationstart",
                iteration: "animationiteration",
                end: "animationend"
            }
        }
    };

    Object.keys(result.properties).forEach(function (key) {
        var val = result.properties[key];
        var capitalized = capitalize(val);
        if (key === "transition") {
            if (("webkit" + capitalized in docStyle) && !(val in docStyle)) {
                result.properties[key] = "-webkit-" + val
            }
        }
    });

    Object.keys(result.events).forEach(function (key) {
        var events = result.events[key];
        var capitalizedKey = capitalize(key);
        var eventName = capitalizedKey + "Event";

        if ("Webkit" + eventName in window && !(eventName in window)) {
            Object.keys(events).forEach(function (type) {
                var capitalizedType = capitalize(type);
                result.events[key][type] = "webkit" + capitalizedKey + capitalizedType;
            });
        }
    });

    return result;
}

module.exports = transAnimName();
