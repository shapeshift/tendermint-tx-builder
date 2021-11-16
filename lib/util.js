"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var hdwallet_core_1 = require("@shapeshiftoss/hdwallet-core");
var bitcoin = __importStar(require("@bithighlander/bitcoin-cash-js-lib"));
var networks_1 = require("./networks");
function getKeyPair(seed, addressNList, network, scriptType) {
    if (network === void 0) { network = "bitcoin"; }
    var path = hdwallet_core_1.addressNListToBIP32(addressNList);
    var keypair = bitcoin.ECPair.fromWIF(seed.derivePath(path).toWIF(), networks_1.getNetwork(network, scriptType));
    return {
        // @ts-ignore
        privateKey: keypair.privateKey.toString("hex"),
        publicKey: keypair.publicKey.toString("hex"),
    };
}
// Prevent malicious JavaScript from replacing the method
exports.default = Object.freeze({
    getKeyPair: getKeyPair,
});
