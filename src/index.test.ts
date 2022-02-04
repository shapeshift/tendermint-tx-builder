import {sign} from '../src/index';
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
    // 'osmosis',
    // 'thorchain',
    // 'terra',
    // 'kava',
    // 'secret',

]

let prefixs = {
    'osmosis':'osmo',
    'cosmos':'cosmos'
}

const REFERENCE_SEED = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

describe('signs Tendermint transactions', async function() {
    let tag = ' | sign | '
    let asset = 'osmosis'
    for(let i = 0; i < supported_assets.length; i++){
        let asset = supported_assets[i]
        console.log("ASSET: ",asset)

        //Osmosis only
        // if(asset === 'osmosis'){
        //     it('signs a mainnet '+asset+' reference swap transaction', async function() {
        //         //get reference data
        //         let referenceTx = fs.readFileSync('./src/reference-data/defi/tx01.mainnet.'+asset+'.swap.json');
        //         referenceTx = JSON.parse(referenceTx.toString())
        //
        //         let referenceTxSigned = fs.readFileSync('./src/reference-data/staking/tx01.mainnet.'+asset+'.swap.signed.json');
        //         referenceTxSigned = JSON.parse(referenceTxSigned.toString())
        //
        //         // log.info(tag,"referenceTx: ",referenceTx)
        //         // log.info(tag,"referenceTxSigned: ",referenceTxSigned)
        //         expect(referenceTx).toBeTruthy();
        //         expect(referenceTxSigned).toBeTruthy();
        //
        //         const network = getNetwork(asset);
        //         const wallet = bitcoin.bip32.fromSeed(await mnemonicToSeed(REFERENCE_SEED), network);
        //
        //         const masterPath = bip32ToAddressNList("m/44'/"+SLIP_44_BY_LONG[asset].toString()+"'/0'/0/0")
        //         log.info(tag,"masterPath: ",masterPath)
        //         // const keyPair = util.getKeyPair(wallet, masterPath, asset);
        //         // log.info(tag,"keyPair: ",keyPair)
        //         // @ts-ignore
        //         let prefix = prefixs[asset]
        //         const result = await sign(referenceTx, REFERENCE_SEED, referenceTx.sequence, referenceTx.account_number, referenceTx.chain_id, prefix);
        //         log.info(tag,"result: ",result)
        //
        //
        //         expect(result.serialized).toBe(referenceTxSigned.serialized);
        //         expect(result.signatures[0]).toBe(referenceTxSigned.signatures[0]);
        //     });
        // }

        it('signs a mainnet '+asset+' reference undelegate transaction', async function() {
            //get reference data
            let referenceTx = fs.readFileSync('./src/reference-data/staking/tx01.mainnet.'+asset+'.undelegate.json');
            referenceTx = JSON.parse(referenceTx.toString())

            let referenceTxSigned = fs.readFileSync('./src/reference-data/staking/tx01.mainnet.'+asset+'.undelegate.signed.json');
            referenceTxSigned = JSON.parse(referenceTxSigned.toString())

            // log.info(tag,"referenceTx: ",referenceTx)
            // log.info(tag,"referenceTxSigned: ",referenceTxSigned)
            expect(referenceTx).toBeTruthy();
            expect(referenceTxSigned).toBeTruthy();

            const network = getNetwork(asset);
            const wallet = bitcoin.bip32.fromSeed(await mnemonicToSeed(REFERENCE_SEED), network);

            const masterPath = bip32ToAddressNList("m/44'/"+SLIP_44_BY_LONG[asset].toString()+"'/0'/0/0")
            log.info(tag,"masterPath: ",masterPath)
            // const keyPair = util.getKeyPair(wallet, masterPath, asset);
            // log.info(tag,"keyPair: ",keyPair)
            // @ts-ignore
            let prefix = prefixs[asset]
            const result = await sign(referenceTx, REFERENCE_SEED, referenceTx.sequence, referenceTx.account_number, referenceTx.chain_id, prefix);
            log.info(tag,"result: ",result)


            expect(result.serialized).toBe(referenceTxSigned.serialized);
            expect(result.signatures[0]).toBe(referenceTxSigned.signatures[0]);
        });

        // it('signs a mainnet '+asset+' reference claim rewards transaction', async function() {
        //     //get reference data
        //     let referenceTx = fs.readFileSync('./src/reference-data/staking/tx01.mainnet.'+asset+'.rewards.json');
        //     referenceTx = JSON.parse(referenceTx.toString())
        //
        //     let referenceTxSigned = fs.readFileSync('./src/reference-data/staking/tx01.mainnet.'+asset+'.rewards.signed.json');
        //     referenceTxSigned = JSON.parse(referenceTxSigned.toString())
        //
        //     // log.info(tag,"referenceTx: ",referenceTx)
        //     // log.info(tag,"referenceTxSigned: ",referenceTxSigned)
        //     expect(referenceTx).toBeTruthy();
        //     expect(referenceTxSigned).toBeTruthy();
        //
        //     const network = getNetwork(asset);
        //     const wallet = bitcoin.bip32.fromSeed(await mnemonicToSeed(REFERENCE_SEED), network);
        //
        //     const masterPath = bip32ToAddressNList("m/44'/"+SLIP_44_BY_LONG[asset].toString()+"'/0'/0/0")
        //     log.info(tag,"masterPath: ",masterPath)
        //     // const keyPair = util.getKeyPair(wallet, masterPath, asset);
        //     // log.info(tag,"keyPair: ",keyPair)
        //     // @ts-ignore
        //     let prefix = prefixs[asset]
        //     const result = await sign(referenceTx, REFERENCE_SEED, referenceTx.sequence, referenceTx.account_number, referenceTx.chain_id, prefix);
        //     log.info(tag,"result: ",result)
        //
        //
        //     expect(result.serialized).toBe(referenceTxSigned.serialized);
        //     expect(result.signatures[0]).toBe(referenceTxSigned.signatures[0]);
        // });

        // it('signs a mainnet '+asset+' reference redelegate transaction', async function() {
        //     //get reference data
        //     let referenceTx = fs.readFileSync('./src/reference-data/staking/tx01.mainnet.'+asset+'.redelegate.json');
        //     referenceTx = JSON.parse(referenceTx.toString())
        //
        //     let referenceTxSigned = fs.readFileSync('./src/reference-data/staking/tx01.mainnet.'+asset+'.redelegate.signed.json');
        //     referenceTxSigned = JSON.parse(referenceTxSigned.toString())
        //
        //     // log.info(tag,"referenceTx: ",referenceTx)
        //     // log.info(tag,"referenceTxSigned: ",referenceTxSigned)
        //     expect(referenceTx).toBeTruthy();
        //     expect(referenceTxSigned).toBeTruthy();
        //
        //     const network = getNetwork(asset);
        //     const wallet = bitcoin.bip32.fromSeed(await mnemonicToSeed(REFERENCE_SEED), network);
        //
        //     const masterPath = bip32ToAddressNList("m/44'/"+SLIP_44_BY_LONG[asset].toString()+"'/0'/0/0")
        //     log.info(tag,"masterPath: ",masterPath)
        //     // const keyPair = util.getKeyPair(wallet, masterPath, asset);
        //     // log.info(tag,"keyPair: ",keyPair)
        //     // @ts-ignore
        //     let prefix = prefixs[asset]
        //     const result = await sign(referenceTx, REFERENCE_SEED, referenceTx.sequence, referenceTx.account_number, referenceTx.chain_id, prefix);
        //     log.info(tag,"result: ",result)
        //
        //
        //     expect(result.serialized).toBe(referenceTxSigned.serialized);
        //     expect(result.signatures[0]).toBe(referenceTxSigned.signatures[0]);
        // });

        // it('signs a mainnet '+asset+' reference delegate transaction', async function() {
        //     //get reference data
        //     let referenceTx = fs.readFileSync('./src/reference-data/staking/tx01.mainnet.'+asset+'.delegate.json');
        //     referenceTx = JSON.parse(referenceTx.toString())
        //
        //     let referenceTxSigned = fs.readFileSync('./src/reference-data/staking/tx01.mainnet.'+asset+'.delegate.signed.json');
        //     referenceTxSigned = JSON.parse(referenceTxSigned.toString())
        //
        //     // log.info(tag,"referenceTx: ",referenceTx)
        //     // log.info(tag,"referenceTxSigned: ",referenceTxSigned)
        //     expect(referenceTx).toBeTruthy();
        //     expect(referenceTxSigned).toBeTruthy();
        //
        //     const network = getNetwork(asset);
        //     const wallet = bitcoin.bip32.fromSeed(await mnemonicToSeed(REFERENCE_SEED), network);
        //
        //     const masterPath = bip32ToAddressNList("m/44'/"+SLIP_44_BY_LONG[asset].toString()+"'/0'/0/0")
        //     log.info(tag,"masterPath: ",masterPath)
        //     // const keyPair = util.getKeyPair(wallet, masterPath, asset);
        //     // log.info(tag,"keyPair: ",keyPair)
        //     // @ts-ignore
        //     let prefix = prefixs[asset]
        //     const result = await sign(referenceTx, REFERENCE_SEED, referenceTx.sequence, referenceTx.account_number, referenceTx.chain_id, prefix);
        //     log.info(tag,"result: ",result)
        //
        //
        //     expect(result.serialized).toBe(referenceTxSigned.serialized);
        //     expect(result.signatures[0]).toBe(referenceTxSigned.signatures[0]);
        // });

        // it('signs a mainnet '+asset+' reference transfer transaction', async function() {
        //     //get reference data
        //     let referenceTx = fs.readFileSync('./src/reference-data/transfers/tx01.mainnet.'+asset+'.json');
        //     referenceTx = JSON.parse(referenceTx.toString())
        //
        //     let referenceTxSigned = fs.readFileSync('./src/reference-data/transfers/tx01.mainnet.'+asset+'.signed.json');
        //     referenceTxSigned = JSON.parse(referenceTxSigned.toString())
        //
        //     log.info(tag,"referenceTx: ",referenceTx)
        //     log.info(tag,"referenceTxSigned: ",referenceTxSigned)
        //     expect(referenceTx).toBeTruthy();
        //     expect(referenceTxSigned).toBeTruthy();
        //
        //     const network = getNetwork(asset);
        //     const wallet = bitcoin.bip32.fromSeed(await mnemonicToSeed(REFERENCE_SEED), network);
        //
        //     const masterPath = bip32ToAddressNList("m/44'/"+SLIP_44_BY_LONG[asset].toString()+"'/0'/0/0")
        //     log.info(tag,"masterPath: ",masterPath)
        //     // const keyPair = util.getKeyPair(wallet, masterPath, asset);
        //     // log.info(tag,"keyPair: ",keyPair)
        //     // @ts-ignore
        //     let prefix = prefixs[asset]
        //     const result = await sign(referenceTx, REFERENCE_SEED, referenceTx.sequence, referenceTx.account_number, referenceTx.chain_id, prefix);
        //     log.info(tag,"result: ",result)
        //
        //
        //     expect(result.serialized).toBe(referenceTxSigned.serialized);
        //     expect(result.signatures[0]).toBe(referenceTxSigned.signatures[0]);
        // });
    }


});
