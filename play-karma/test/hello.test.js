var assert = require("power-assert");

describe("hello()", function () {
    it("\"Hello, Me\" と返すこと", function () {
        assert.equal(hello("Me"), "Hello, Me");
    });
    it("\"Hello, Me\" と返すこと", function () {
        assert.equal(hello(""), "Hello, Me");
    });
});
