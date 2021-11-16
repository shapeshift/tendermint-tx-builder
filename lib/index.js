"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSignedTx = exports.sign = void 0;
var secp256k1 = require('secp256k1');
var sha256 = require("crypto-js/sha256");
function sign(jsonTx, wallet, sequence, account_number, chain_id) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, signMessage, signatureBuffer, pubKeyBuffer, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | sign | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, create_sign_message(jsonTx, sequence, account_number, chain_id)];
                case 2:
                    signMessage = _a.sent();
                    return [4 /*yield*/, sign_with_privkey(signMessage, wallet.privateKey !== undefined ? wallet.privateKey : wallet)];
                case 3:
                    signatureBuffer = _a.sent();
                    pubKeyBuffer = Buffer.from(wallet.publicKey, "hex");
                    return [2 /*return*/, format_signature(signatureBuffer, pubKeyBuffer)];
                case 4:
                    e_1 = _a.sent();
                    console.error(tag, "e: ", e_1);
                    return [2 /*return*/, {}];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.sign = sign;
function createSignedTx(tx, signature) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!tx.signatures)
                tx.signatures = [];
            tx.signatures = [signature];
            return [2 /*return*/, tx];
        });
    });
}
exports.createSignedTx = createSignedTx;
var create_sign_message = function (jsonTx, sequence, account_number, chain_id) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, fee;
        return __generator(this, function (_a) {
            tag = " | create_sign_message | ";
            try {
                fee = {
                    amount: jsonTx.fee.amount || [],
                    gas: jsonTx.fee.gas
                };
                return [2 /*return*/, JSON.stringify(prepareSignBytes({
                        //@ts-ignore
                        fee: fee,
                        memo: jsonTx.memo,
                        msgs: jsonTx.msg,
                        sequence: sequence,
                        account_number: account_number,
                        chain_id: chain_id
                    }))];
            }
            catch (e) {
                console.error(e);
                throw Error(e);
            }
            return [2 /*return*/];
        });
    });
};
var prepareSignBytes = function (jsonTx) {
    if (Array.isArray(jsonTx)) {
        return jsonTx.map(prepareSignBytes);
    }
    // string or number
    if (typeof jsonTx !== "object") {
        return jsonTx;
    }
    var sorted = {};
    Object.keys(jsonTx)
        .sort()
        .forEach(function (key) {
        if (jsonTx[key] === undefined || jsonTx[key] === null)
            return;
        sorted[key] = prepareSignBytes(jsonTx[key]);
    });
    return sorted;
};
var sign_with_privkey = function (signMessage, privateKey) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, signature;
        return __generator(this, function (_a) {
            tag = " | sign_with_privkey | ";
            try {
                if (!signMessage)
                    throw Error("signMessage required!");
                signature = (typeof privateKey.sign === "function" ? privateKey.sign(signMessage) : (function () {
                    var signHash = Buffer.from(sha256(signMessage).toString(), "hex");
                    return secp256k1.sign(signHash, Buffer.from(privateKey, "hex")).signature;
                })());
                return [2 /*return*/, signature];
            }
            catch (e) {
                console.error(e);
                throw Error(e);
            }
            return [2 /*return*/];
        });
    });
};
// signature, sequence, account_number, publicKey
var format_signature = function (signature, publicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = " | format_signature | ";
            try {
                return [2 /*return*/, {
                        signature: signature.toString("base64"),
                        pub_key: {
                            type: "tendermint/PubKeySecp256k1",
                            value: publicKey.toString("base64")
                        }
                    }];
            }
            catch (e) {
                console.error(e);
                throw Error(e);
            }
            return [2 /*return*/];
        });
    });
};
