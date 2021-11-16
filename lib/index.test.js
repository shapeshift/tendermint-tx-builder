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
var index_1 = require("../src/index");
var _a = require('@pioneer-platform/pioneer-coins'), SLIP_44_BY_LONG = _a.SLIP_44_BY_LONG, bip32ToAddressNList = _a.bip32ToAddressNList;
var bip39_1 = require("bip39");
var bitcoin = __importStar(require("@bithighlander/bitcoin-cash-js-lib"));
var networks_1 = require("./networks");
var fs = require("fs");
var log = require("@pioneer-platform/loggerdog")();
var supported_assets = [
    'cosmos',
    'thorchain',
    'terra',
    'kava',
    'secret',
    'osmosis'
];
var REFERENCE_SEED = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle";
describe('signs Tendermint transactions', function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, _loop_1, i;
        return __generator(this, function (_a) {
            tag = ' | sign | ';
            _loop_1 = function (i) {
                var asset = supported_assets[i];
                it('signs a mainnet ' + asset + ' reference transfer transaction', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var referenceTx, referenceTxSigned, network, wallet, _a, _b, masterPath, result, SignedTx;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    referenceTx = fs.readFileSync('./src/reference-data/transfers/tx01.mainnet.' + asset + '.json');
                                    referenceTx = JSON.parse(referenceTx.toString());
                                    referenceTxSigned = fs.readFileSync('./src/reference-data/transfers/tx01.mainnet.' + asset + '.signed.json');
                                    referenceTxSigned = JSON.parse(referenceTxSigned.toString());
                                    log.info(tag, "referenceTx: ", referenceTx);
                                    log.info(tag, "referenceTxSigned: ", referenceTxSigned);
                                    expect(referenceTx).toBeTruthy();
                                    expect(referenceTxSigned).toBeTruthy();
                                    network = networks_1.getNetwork(asset);
                                    _b = (_a = bitcoin.bip32).fromSeed;
                                    return [4 /*yield*/, bip39_1.mnemonicToSeed(REFERENCE_SEED)];
                                case 1:
                                    wallet = _b.apply(_a, [_c.sent(), network]);
                                    masterPath = bip32ToAddressNList("m/44'/" + SLIP_44_BY_LONG[asset].toString() + "'/0'/0/0");
                                    log.info(tag, "masterPath: ", masterPath);
                                    return [4 /*yield*/, index_1.sign(referenceTx, wallet, referenceTx.sequence, referenceTx.account_number, referenceTx.chain_id)];
                                case 2:
                                    result = _c.sent();
                                    log.info(tag, "result: ", result);
                                    return [4 /*yield*/, index_1.createSignedTx(referenceTx, result)];
                                case 3:
                                    SignedTx = _c.sent();
                                    log.info(tag, "SignedTx: ", SignedTx);
                                    expect(SignedTx.signatures[0].signature).toBe(referenceTxSigned.signatures[0].signature);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            };
            for (i = 0; i < supported_assets.length; i++) {
                _loop_1(i);
            }
            return [2 /*return*/];
        });
    });
});
