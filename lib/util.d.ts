import { BTCInputScriptType, BTCOutputScriptType } from "@shapeshiftoss/hdwallet-core";
import * as bitcoin from "@bithighlander/bitcoin-cash-js-lib";
declare type BTCScriptType = BTCInputScriptType | BTCOutputScriptType;
declare function getKeyPair(seed: bitcoin.BIP32Interface, addressNList: number[], network?: string, scriptType?: BTCScriptType): {
    privateKey: string;
    publicKey: string;
};
declare const _default: Readonly<{
    getKeyPair: typeof getKeyPair;
}>;
export default _default;
