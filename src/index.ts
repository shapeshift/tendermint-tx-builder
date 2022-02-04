
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import { coins, Registry } from "@cosmjs/proto-signing";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { HdPath, Slip10RawIndex } from "@cosmjs/crypto";
// import {osmosis} from "@pioneer-platform/osmosis-tx-codecs"

export async function sign(jsonTx:any, seed:string, sequence:string, account_number:string, chain_id:string, prefix:string) {
    let tag = " | sign | ";
    try {
        //TODO dont assume mnemonic
        let path = makeCosmoshubPath(0)
        // const myRegistry = new Registry(defaultStargateTypes);
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(seed,{hdPaths: [path],prefix});
        const clientOffline = await SigningStargateClient.offline(wallet);
        const [account] = await wallet.getAccounts();

        // myRegistry.register("/gamm.swap-exact-amount-in", osmosis.v1beta1.MsgSwapExactAmountIn);

        let {msg,from,fee,memo} = parse_legacy_tx_format(jsonTx)
        if(from !== account.address){
            console.log("from:",from)
            console.log("account: ",account.address)
            console.error("invalid from address!")
        }

        let txData:any = {
            accountNumber: account_number,
            sequence: sequence,
            chainId: chain_id,
            msgs: [msg],
            fee,
            memo,
        }
        const signerData: any = {
            accountNumber: txData.accountNumber,
            sequence: txData.sequence,
            chainId: txData.chainId,
        };

        console.log("{msg,from,fee}: ",{msg,from,fee})
        console.log("MSG: ",JSON.stringify(msg))
        const txRaw = await clientOffline.sign(
            from,
            txData.msgs,
            txData.fee,
            txData.memo,
            signerData,
        );

        console.log("txRaw: ",txRaw)
        // @ts-ignore
        let body = txRaw.bodyBytes.toString("base64")
        // @ts-ignore
        let authInfoBytes = txRaw.authInfoBytes.toString("base64")
        // @ts-ignore
        let signatures = [new Buffer(txRaw.signatures[0]).toString("base64")]

        let output = {
            // @ts-ignore
            serialized:TxRaw.encode(txRaw).finish().toString("base64"),
            body,
            authInfoBytes,
            signatures
        }
        console.log("output: ",output)
        // @ts-ignore
        return output
    } catch (e) {
        console.error(tag, "e: ", e);
        throw Error(e)
    }
}

function makeCosmoshubPath(a: number): HdPath {
    return [
        Slip10RawIndex.hardened(44),
        Slip10RawIndex.hardened(118),
        Slip10RawIndex.hardened(0),
        Slip10RawIndex.normal(0),
        Slip10RawIndex.normal(a),
    ];
}

const parse_legacy_tx_format = function(jsonTx:any){
    try{
        let txType = jsonTx.msg[0].type
        if(!txType) throw Error("Invalid jsonTx input")
        if(jsonTx.msg[1]) throw Error("multiple msgs not supported!")

        let msg
        let from
        let fee
        let memo
        //switch for each tx type supported
        switch (txType) {
            case 'cosmos-sdk/MsgSend':
                if(!jsonTx.msg[0].value.from_address) throw Error("Missing from_address in msg[0]")
                if(!jsonTx.msg[0].value.to_address) throw Error("Missing to_address in msg[0]")
                if(!jsonTx.msg[0].value.amount[0].amount) throw Error("Missing amount in msg[0] value.amount[0]")
                from = jsonTx.msg[0].value.from_address
                memo = jsonTx.memo
                const msgSend: any = {
                    fromAddress: jsonTx.msg[0].value.from_address,
                    toAddress: jsonTx.msg[0].value.to_address,
                    amount: coins(parseInt(jsonTx.msg[0].value.amount[0].amount), jsonTx.msg[0].value.amount[0].denom),
                };
                msg = {
                    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                    value: msgSend,
                };
                fee = {
                    amount: coins(parseInt(jsonTx.fee.amount[0].amount), jsonTx.fee.amount[0].denom),
                    gas: jsonTx.fee.gas,
                };
                break;
            case 'cosmos-sdk/MsgDelegate':
                if(!jsonTx.msg[0].value.delegator_address) throw Error("Missing delegator_address in msg[0]")
                if(!jsonTx.msg[0].value.validator_address) throw Error("Missing validator_address in msg[0]")
                if(!jsonTx.msg[0].value.amount.amount) throw Error("Missing amount in msg[0] value.amount[0]")
                from = jsonTx.msg[0].value.delegator_address
                memo = jsonTx.memo
                const msgDelegate: any = {
                    delegatorAddress: jsonTx.msg[0].value.delegator_address,
                    validatorAddress: jsonTx.msg[0].value.validator_address,
                    amount: coins(parseInt(jsonTx.msg[0].value.amount.amount), jsonTx.msg[0].value.amount.denom)[0],
                };
                msg = {
                    typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                    value: msgDelegate,
                };
                fee = {
                    amount: coins(parseInt(jsonTx.fee.amount[0].amount), jsonTx.fee.amount[0].denom),
                    gas: jsonTx.fee.gas,
                };
                break;
            case 'cosmos-sdk/MsgUndelegate':
                if(!jsonTx.msg[0].value.delegator_address) throw Error("Missing delegator_address in msg[0]")
                if(!jsonTx.msg[0].value.validator_address) throw Error("Missing validator_address in msg[0]")
                if(!jsonTx.msg[0].value.amount.amount) throw Error("Missing amount in msg[0] value.amount[0]")
                from = jsonTx.msg[0].value.delegator_address
                memo = jsonTx.memo
                const msgUnDelegate: any = {
                    delegatorAddress: jsonTx.msg[0].value.delegator_address,
                    validatorAddress: jsonTx.msg[0].value.validator_address,
                    amount: coins(parseInt(jsonTx.msg[0].value.amount.amount), jsonTx.msg[0].value.amount.denom)[0],
                };
                msg = {
                    typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
                    value: msgUnDelegate,
                };
                fee = {
                    amount: coins(parseInt(jsonTx.fee.amount[0].amount), jsonTx.fee.amount[0].denom),
                    gas: jsonTx.fee.gas,
                };
                break;
            case 'cosmos-sdk/MsgBeginRedelegate':
                if(!jsonTx.msg[0].value.delegator_address) throw Error("Missing delegator_address in msg[0]")
                if(!jsonTx.msg[0].value.validator_src_address) throw Error("Missing validator_src_address in msg[0]")
                if(!jsonTx.msg[0].value.validator_dst_address) throw Error("Missing validator_dst_address in msg[0]")
                if(!jsonTx.msg[0].value.amount.amount) throw Error("Missing amount in msg[0] value.amount[0]")
                from = jsonTx.msg[0].value.delegator_address
                memo = jsonTx.memo
                const msgReDelegate: any = {
                    delegatorAddress: jsonTx.msg[0].value.delegator_address,
                    validatorSrcAddress: jsonTx.msg[0].value.validator_src_address,
                    validatorDstAddress: jsonTx.msg[0].value.validator_dst_address,
                    amount: coins(parseInt(jsonTx.msg[0].value.amount.amount), jsonTx.msg[0].value.amount.denom)[0],
                };
                msg = {
                    typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
                    value: msgReDelegate,
                };
                fee = {
                    amount: coins(parseInt(jsonTx.fee.amount[0].amount), jsonTx.fee.amount[0].denom),
                    gas: jsonTx.fee.gas,
                };
                break;
            case 'cosmos-sdk/MsgWithdrawDelegatorReward':
                if(!jsonTx.msg[0].value.delegator_address) throw Error("Missing delegator_address in msg[0]")
                if(!jsonTx.msg[0].value.validator_address) throw Error("Missing validator_address in msg[0]")
                if(!jsonTx.msg[0].value.amount.amount) throw Error("Missing amount in msg[0] value.amount[0]")
                from = jsonTx.msg[0].value.delegator_address
                memo = jsonTx.memo
                const msgRewards: any = {
                    delegatorAddress: jsonTx.msg[0].value.delegator_address,
                    validatorAddress: jsonTx.msg[0].value.validator_address,
                    amount: coins(parseInt(jsonTx.msg[0].value.amount.amount), jsonTx.msg[0].value.amount.denom)[0],
                };
                msg = {
                    typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                    value: msgRewards,
                };
                fee = {
                    amount: coins(parseInt(jsonTx.fee.amount[0].amount), jsonTx.fee.amount[0].denom),
                    gas: jsonTx.fee.gas,
                };
                break;
            case 'osmosis/gamm/swap-exact-amount-in':
                //TODO
                const msgSwap: any = {

                };
                msg = {
                    typeUrl: "/gamm.swap-exact-amount-in",
                    value: msgRewards,
                };
                fee = {
                    amount: coins(parseInt(jsonTx.fee.amount[0].amount), jsonTx.fee.amount[0].denom),
                    gas: jsonTx.fee.gas,
                };
                break;
            default:
                throw Error("Unhandled tx type! type: "+txType)
        }
        if(!from) throw Error("Failed to parse from address!")
        if(!msg) throw Error("Failed to parse msg!")
        if(!fee) throw Error("Failed to parse fee!")
        return {msg,from,fee,memo}
    }catch(e){
        throw Error(e)
    }
}