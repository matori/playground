function attr(el, key, val) {

    if (key && typeof key !== "string") {
        Object.keys(key).forEach(function (k) {
            attr(el, k, key[k]);
        });
        return;
    }

    if (val === null) {
        return el.removeAttribute(key);
    } else if (val === undefined) {
        return el.getAttribute(key);
    } else {
        return el.setAttribute(key, (val).toString());
    }
}
