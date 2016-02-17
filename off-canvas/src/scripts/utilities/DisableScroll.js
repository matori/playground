"use strict";

var keycode = require("keycode");
var pointerEvents = require("./pointer");

var disableKeyCodes = /pgup|pgdn|up|down|left|right|home|end|space/;
var isTouchable = pointerEvents.touchable;
var eventName = pointerEvents.name;

var DisableScroll = function DisableScroll(context, exceptContext) {
    this._el = context || window;
    this._except = exceptContext || null;
    this._isDisabled = false;
    this._isPointerDown = false;
    this._currentScrollX = 0;
    this._currentScrollY = 0;

    this._bind = {
        _disableBasicScroll: this._disableBasicScroll.bind(this),
        _activatePointerDown: this._activatePointerDown.bind(this),
        _deactivatePointerDown: this._deactivatePointerDown.bind(this),
        _disablePointerMove: this._disablePointerMove.bind(this)
    };

    this._disableFunctionsCommon = {
        "scroll": this._bind._disableBasicScroll,
        "wheel": this._disableWheel,
        "keydown": this._disableScrollKey
    };

    this._disableFunctionsTuch = {};
    this._disableFunctionsTuch[eventName.down] = this._bind._activatePointerDown;
    this._disableFunctionsTuch[eventName.move] = this._bind._deactivatePointerDown;
    this._disableFunctionsTuch[eventName.up] = this._bind._disablePointerMove;

    this._disableFunctionsCommonKeys = Object.keys(this._disableFunctionsCommon);
    this._disableFunctionsTouchKeys = Object.keys(this._disableFunctionsTuch);
};

DisableScroll.prototype._setCurrentScrollPos = function() {
    this._currentScrollX = window.pageXOffset;
    this._currentScrollY = window.pageYOffset;
};

DisableScroll.prototype._disableBasicScroll = function(evt) {
    evt.preventDefault();
    window.scroll(this._currentScrollX, this._currentScrollY);
};

DisableScroll.prototype._activatePointerDown = function() {
    this._isPointerDown = true;
};

DisableScroll.prototype._deactivatePointerDown = function() {
    this._isPointerDown = false;
};

DisableScroll.prototype._disablePointerMove = function(evt) {
    if (this._isPointerDown) {
        evt.preventDefault();
    }
};

DisableScroll.prototype._disableWheel = function(evt) {
    evt.preventDefault();
};

DisableScroll.prototype._disableScrollKey = function(evt) {
    var key = keycode(evt);
    if (disableKeyCodes.test(key)) {
        evt.preventDefault();
    }
};

DisableScroll.prototype._exceptAction = function(evt) {
    if (evt.type === "keydown" && !disableKeyCodes.test(keycode(evt))) {
        return;
    }
    evt.stopPropagation();
};

DisableScroll.prototype._toggleListeners = function(type) {
    var method;

    if (!type || (type !== "add" && type !== "remove")) {
        throw "argument must be \"add\" or \"remove\"";
    }

    method = type + "EventListener";

    this._disableFunctionsCommonKeys.forEach(function(key) {
        this._el[method](key, this._disableFunctionsCommon[key], false);

        if (this._except) {
            this._except[method](key, this._exceptAction, false);
        }
    }.bind(this));

    if (isTouchable) {
        this._disableFunctionsTouchKeys.forEach(function(key) {
            this._el[method](key, this._disableFunctionsTuch[key], false);

            if (this._except) {
                this._except[method](key, this._exceptAction, false);
            }
        }.bind(this));
    }
};

DisableScroll.prototype.start = function(callback) {
    if (!this._isDisabled) {
        this._setCurrentScrollPos();
        this._toggleListeners("add");
        this._isDisabled = true;

        if (typeof callback === "function") {
            callback();
        }
    }
};

DisableScroll.prototype.stop = function(callback) {
    if (this._isDisabled) {
        this._toggleListeners("remove");
        this._isDisabled = false;

        if (typeof callback === "function") {
            callback();
        }
    }
};

module.exports = DisableScroll;
