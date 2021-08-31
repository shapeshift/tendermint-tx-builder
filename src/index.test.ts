import {sign,createSignedTx} from '../src/index';
let {
    SLIP_44_BY_LONG,
    bip32ToAddressNList
} = require('@pioneer-platform/pioneer-coins')
import { mnemonicToSeed, validateMnemonic } from "bip39";
import * as bitcoin from "@bithighlander/bitcoin-cash-js-lib";
import { default as util } from "./util";
import { getNetwork } from "./networks";
const fs = require("fs");
const log = require("@pioneer-platform/loggerdog")()

const supported_assets = [
    'cosmos',
    'thorchain',
    'terra',
    'kava',
    'secret',
    'osmosis'
]

const REFERENCE_SEED = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

describe('signs Tendermint transactions', async function() {
    let tag = ' | sign | '
    for(let i = 0; i < supported_assets.length; i++){
        let asset = supported_assets[i]

        it('signs a mainnet '+asset+' reference transfer transaction', async function() {
            //get reference data
            let referenceTx = fs.readFileSync('./src/reference-data/transfers/tx01.mainnet.'+asset+'.json');
            referenceTx = JSON.parse(referenceTx.toString())

            let referenceTxSigned = fs.readFileSync('./src/reference-data/transfers/tx01.mainnet.'+asset+'.signed.json');
            referenceTxSigned = JSON.parse(referenceTxSigned.toString())

            log.info(tag,"referenceTx: ",referenceTx)
            log.info(tag,"referenceTxSigned: ",referenceTxSigned)
            expect(referenceTx).toBeTruthy();
            expect(referenceTxSigned).toBeTruthy();

            const network = getNetwork(asset);
            const wallet = bitcoin.bip32.fromSeed(await mnemonicToSeed(REFERENCE_SEED), network);

            const masterPath = bip32ToAddressNList("m/44'/"+SLIP_44_BY_LONG[asset].toString()+"'/0'/0/0")
            log.info(tag,"masterPath: ",masterPath)
            // const keyPair = util.getKeyPair(wallet, masterPath, asset);
            // log.info(tag,"keyPair: ",keyPair)

            const result = await sign(referenceTx, wallet, referenceTx.sequence, referenceTx.account_number, referenceTx.chain_id);
            log.info(tag,"result: ",result)
            const SignedTx = await createSignedTx(referenceTx, result);
            log.info(tag,"SignedTx: ",SignedTx)

            expect(SignedTx.signatures[0].signature).toBe(referenceTxSigned.signatures[0].signature);
        });

        //TODO testnets

    }


});
