var assert = require("power-assert");

describe("attr()", function () {
    var div;

    beforeEach(function () {
        document.body.innerHTML = window.__html__["test/fixtures/attr.html"];
        div = document.getElementById("div");
    });

    afterEach(function () {
        document.body.innerHTML = "";
        div = null;
    });

    describe("属性値の取得", function () {

        it("tabindex属性値を取得する", function () {
            assert(attr(div, "tabindex") === "-1");
        });

        it("未設定の属性値を取得する", function () {
            assert(div.hasAttribute("foo") === false);
        });

    });

    describe("属性の削除", function () {

        it("tabindex属性を削除する", function () {
            attr(div, "tabindex", null);
            assert(div.hasAttribute("tabindex") === false);
        });

    });

    describe("属性値の設定", function () {

        it("値に文字列を設定", function () {
            attr(div, "foo", "bar");
            assert(div.getAttribute("foo") === "bar");
        });

        it("値に真偽値を設定", function () {
            attr(div, "foo", true);
            attr(div, "bar", false);
            assert(div.getAttribute("foo") === "true");
            assert(div.getAttribute("bar") === "false");
        });

        it("値に数値を設定", function () {
            attr(div, "foo", 3);
            attr(div, "bar", 3.1);
            assert(div.getAttribute("foo") === "3");
            assert(div.getAttribute("bar") === "3.1");
        });

        it("値にオブジェクトを設定", function () {
            attr(div, "foo", {});
            assert(div.getAttribute("foo") === "[object Object]");
        });

        it("値に空配列を設定", function () {
            attr(div, "foo", []);
            assert(div.getAttribute("foo") === "");
        });

        it("値に配列を設定", function () {
            attr(div, "foo", [1, 2, 3]);
            assert(div.getAttribute("foo") === "1,2,3");
        });

        it("値にnullを設定（要素の削除）", function () {
            attr(div, "foo", null);
            assert(div.hasAttribute("foo") === false);
        });

        it("値にundefinedを設定（値の取得と等価）", function () {
            attr(div, "foo", undefined);
            // 存在していない属性なのでnullになる
            assert(div.getAttribute("foo") === null);
        });
    });

    describe("オブジェクトによる設定", function () {

        it("属性の削除と追加", function () {
            attr(div, {
                "tabindex": null,
                "foo": "foo!",
                "bar": "bar!"
            });
            assert(div.hasAttribute("tabindex") === false);
            assert(div.getAttribute("foo") === "foo!");
            assert(div.getAttribute("bar") === "bar!");
        });
    });
});
