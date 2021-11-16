"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var networks_1 = require("./networks");
describe("getNetwork", function () {
    it("should return the bitcoin network", function () {
        expect(networks_1.getNetwork("bitcoin")).toMatchObject({
            bech32: "bc",
            pubKeyHash: 0x00,
            scriptHash: 0x05,
            wif: 0x80,
        });
    });
    it("should return the testnet network", function () {
        expect(networks_1.getNetwork("testnet")).toMatchObject({
            bech32: "tb",
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            wif: 0xef,
        });
    });
    it("should throw if asked for an unsupported network", function () {
        expect(function () { return networks_1.getNetwork("foobar"); }).toThrowError("foobar network not supported");
    });
    it("should throw if asked for an unsupported script type", function () {
        expect(function () { return networks_1.getNetwork("bitcoin", "foobar"); }).toThrowError("foobar not supported for bitcoin network");
    });
});
