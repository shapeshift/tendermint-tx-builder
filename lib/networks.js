"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetwork = void 0;
var bip32BTC = {
    p2sh: {
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
    },
    p2pkh: {
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
    },
    "p2sh-p2wpkh": {
        bip32: {
            public: 0x049d7cb2,
            private: 0x049d7878,
        },
    },
    p2wpkh: {
        bip32: {
            public: 0x04b24746,
            private: 0x04b2430c,
        },
    },
};
var networks = {
    bitcoin: __assign({ base: {
            messagePrefix: "\x18Bitcoin Signed Message:\n",
            bech32: "bc",
            pubKeyHash: 0x00,
            scriptHash: 0x05,
            wif: 0x80,
        } }, bip32BTC),
    dash: {
        base: {
            messagePrefix: "unused",
            bech32: "",
            pubKeyHash: 0x4c,
            scriptHash: 0x10,
            wif: 0xcc,
        },
        p2sh: bip32BTC.p2sh,
        p2pkh: bip32BTC.p2pkh,
    },
    digibyte: __assign({ base: {
            messagePrefix: "\x19Digibyte Signed Message:\n",
            bech32: "dgb",
            pubKeyHash: 0x1e,
            scriptHash: 0x3f,
            wif: 0x80,
        } }, bip32BTC),
    dogecoin: {
        base: {
            messagePrefix: "\x19Dogecoin Signed Message:\n",
            bech32: "",
            pubKeyHash: 0x1e,
            scriptHash: 0x16,
            wif: 0x9e,
        },
        p2sh: {
            bip32: {
                public: 0x02facafd,
                private: 0x02fac398,
            },
        },
        p2pkh: {
            bip32: {
                public: 0x02facafd,
                private: 0x02fac398,
            },
        },
    },
    litecoin: {
        base: {
            messagePrefix: "\x19Litecoin Signed Message:\n",
            bech32: "ltc",
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0,
        },
        p2sh: {
            bip32: {
                public: 0x019da462,
                private: 0x019d9cfe,
            },
        },
        p2pkh: {
            bip32: {
                public: 0x019da462,
                private: 0x019d9cfe,
            },
        },
        "p2sh-p2wpkh": {
            bip32: {
                public: 0x01b26ef6,
                private: 0x01b26792,
            },
        },
        p2wpkh: bip32BTC.p2wpkh,
    },
    testnet: {
        base: {
            messagePrefix: "\x18Bitcoin Signed Message:\n",
            bech32: "tb",
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            wif: 0xef,
        },
        p2sh: {
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
        },
        p2pkh: {
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
        },
        "p2sh-p2wpkh": {
            bip32: {
                public: 0x044a5262,
                private: 0x044a4e28,
            },
        },
        p2wpkh: {
            bip32: {
                public: 0x045f1cf6,
                private: 0x045f18bc,
            },
        },
    },
};
//TODO: all below are missing network data
for (var _i = 0, _a = ["bitcoincash", "thorchain", "secret", "terra", "kava", "cardano", "cosmos", "osmosis", "binance", "ethereum"]; _i < _a.length; _i++) {
    var coin = _a[_i];
    networks[coin] = networks.bitcoin;
}
function getNetwork(coin, scriptType) {
    coin = coin.toLowerCase();
    if (!(coin in networks))
        throw new Error(coin + " network not supported");
    var network = networks[coin];
    // @ts-ignore
    var bip32 = network[scriptType || "p2sh"];
    if (!bip32) {
        throw new Error(scriptType + " not supported for " + coin + " network");
    }
    return __assign(__assign({}, network.base), bip32);
}
exports.getNetwork = getNetwork;
