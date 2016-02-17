"use strict";

var keycode = require("keycode");
var getFocusableElements = require("../utilities/getFocusableElements");
var transAnimName = require("../utilities/transAnimName");
var DisableScroll = require("../utilities/DisableScroll");

var transform = transAnimName.properties.transform;
var transitionend = transAnimName.events.transition.end;
var activeClass = "is-active";

function getTabindexCache(elementsArr) {
    var result = [];
    elementsArr.forEach(function (el) {
        var val = el.hasAttribute("tabindex") ? el.getAttribute("tabindex") : null;
        result.push(val);
    });
    return result;
}

function toggleTabFocusable(elementsArr, cacheArr) {
    cacheArr = cacheArr || [];
    elementsArr.forEach(function (el, idx) {
        var val = cacheArr[idx];
        if (val === null) {
            el.removeAttribute("tabindex");
        } else {
            val = val || "-1";
            el.setAttribute("tabindex", val);
        }
    });
}

function getMethodName(type) {
    if (!type || type !== "add" && type !== "remove") {
        throw "argument must be \"add\" or \"remove\"";
    }
    return type + "EventListener";
}

function validateAction(action) {
    if (!action || action !== "open" && action !== "close") {
        throw "argument must be \"open\" or \"close\"";
    }
    return true;
}

var Nav = function Nav(selectors) {
    this._nav = document.querySelector(selectors.nav);
    this._navLinks = document.querySelectorAll("a[href^=\"#\"]:not(" + selectors.closeButton + ")", this._nav);
    this._openButton = document.querySelector(selectors.openButton);
    this._closeButton = document.querySelector(selectors.closeButton);
    this._otherAreas = document.querySelectorAll(selectors.otherAreas);
    this._bind = {};

    // array
    this._focusableElementsWithoutNav = getFocusableElements(selectors.nav + ", " + selectors.nav + " *");
    this._focusableElementsWithinNav = getFocusableElements(null, this._nav);
    this._tabindexCacheWithoutNav = [];
    this._tabindexCacheWithinNav = [];

    // instance
    this._disableScroll = new DisableScroll(window, this._nav);

    // init
    this.init();
};

Nav.prototype._setTabindexCache = function () {
    this._tabindexCacheWithoutNav = getTabindexCache(this._focusableElementsWithoutNav);
    this._tabindexCacheWithinNav = getTabindexCache(this._focusableElementsWithinNav);
};

Nav.prototype._transitionendNavHandler = function (action, evt) {
    if (!validateAction(action) || evt.propertyName !== transform) {
        return;
    }
    this._toggleNavHandler("remove", action);
    this._nav.removeAttribute("aria-busy");
};

Nav.prototype._toggleNavHandler = function (type, action) {
    var method;
    var handlerMethod = "_transitionend";
    if (!validateAction(action)) {
        return;
    }
    method = getMethodName(type);
    handlerMethod += action === "open" ? "Open" : "Close";
    handlerMethod += "NavHandler";
    this._nav[method](transitionend, this._bind[handlerMethod], false);
};

Nav.prototype._openNav = function () {
    toggleTabFocusable(this._focusableElementsWithoutNav);
    toggleTabFocusable(this._focusableElementsWithinNav, this._tabindexCacheWithinNav);
    this._toggleNavHandler("add", "open");
    this._disableScroll.start();
    this._nav.setAttribute("aria-hidden", "false");
    this._nav.setAttribute("aria-busy", "true");
    for (var i = 0, iz = this._otherAreas.length; i < iz; i++) {
        this._otherAreas[i].setAttribute("aria-hidden", "true");
    }
    this._toggleOpenHandlers("remove");
    this._toggleCloseHandlers("add");
    this._nav.focus();
};

Nav.prototype._closeNav = function (openButtonFocus, callback) {
    toggleTabFocusable(this._focusableElementsWithinNav);
    toggleTabFocusable(this._focusableElementsWithoutNav, this._tabindexCacheWithoutNav);
    this._toggleNavHandler("add", "close");
    this._disableScroll.stop(callback);
    this._nav.setAttribute("aria-hidden", "true");
    this._nav.setAttribute("aria-busy", "true");
    for (var i = 0, iz = this._otherAreas.length; i < iz; i++) {
        this._otherAreas[i].removeAttribute("aria-hidden");
    }
    this._toggleCloseHandlers("remove");
    this._toggleOpenHandlers("add");
    if (openButtonFocus) {
        this._openButton.focus();
    }
};

Nav.prototype._buttonEventHandler = function (action, evt) {
    if (!validateAction(action) || (evt.type === "keydown" && keycode(evt) !== "space")) {
        return;
    }
    evt.preventDefault();
    this["_" + action + "Nav"](true);
};

Nav.prototype._closeActionHandler = function (evt) {
    if (evt.type === "keydown" && keycode(evt) !== "esc") {
        return;
    }
    evt.preventDefault();
    this._closeNav(true);
};

Nav.prototype._toggleOpenHandlers = function (type) {
    var method = getMethodName(type);
    this._openButton[method]("click", this._bind._buttonOpenEventHandler, false);
    this._openButton[method]("keydown", this._bind._buttonOpenEventHandler, false);
};

Nav.prototype._toggleCloseHandlers = function (type) {
    var method = getMethodName(type);
    this._closeButton[method]("click", this._bind._buttonCloseEventHandler, false);
    this._closeButton[method]("keydown", this._bind._buttonCloseEventHandler, false);
    window[method]("keydown", this._bind._closeActionHandler, false);
};

Nav.prototype._setBind = function () {
    this._bind._buttonOpenEventHandler = this._buttonEventHandler.bind(this, "open");
    this._bind._buttonCloseEventHandler = this._buttonEventHandler.bind(this, "close");
    this._bind._closeActionHandler = this._closeActionHandler.bind(this);
    this._bind._transitionendOpenNavHandler = this._transitionendNavHandler.bind(this, "open");
    this._bind._transitionendCloseNavHandler = this._transitionendNavHandler.bind(this, "close");
};

Nav.prototype.init = function () {
    this._setBind();
    this._setTabindexCache();
};

Nav.prototype.start = function () {
    this._toggleOpenHandlers("add");
    this._nav.style.transition = "none";
    this._nav.style.webkitTransition = "none";
    this._nav.setAttribute("tabindex", "-1");
    this._nav.setAttribute("aria-hidden", "true");
    setTimeout(function () {
        this._nav.style.transition = "";
        this._nav.style.webkitTransition = "";
        this._nav.classList.add(activeClass);
    }.bind(this), 4);
};

Nav.prototype.stop = function () {
    this._toggleOpenHandlers("remove");
    this._toggleCloseHandlers("remove");
    this._toggleNavHandler("remove", "open");
    this._toggleNavHandler("remove", "close");
    this._disableScroll.stop();
    toggleTabFocusable(this._focusableElementsWithinNav, this._tabindexCacheWithinNav);
    toggleTabFocusable(this._focusableElementsWithoutNav, this._tabindexCacheWithoutNav);
    this._nav.classList.remove(activeClass);
    setTimeout(function () {
        this._nav.removeAttribute("tabindex");
        this._nav.removeAttribute("aria-hidden");
        this._nav.removeAttribute("aria-busy");
    }.bind(this), 4);
};

module.exports = Nav;
