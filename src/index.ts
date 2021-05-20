
const secp256k1 = require('secp256k1')
const sha256 = require("crypto-js/sha256")

export async function sign(jsonTx:any, wallet:any, sequence:string, account_number:string, chain_id:string) {
    let tag = " | sign | ";
    try {
        const signMessage = await create_sign_message(jsonTx, sequence, account_number, chain_id)

        const signatureBuffer = await sign_with_privkey(signMessage, wallet.privateKey !== undefined ? wallet.privateKey : wallet)

        const pubKeyBuffer = Buffer.from(wallet.publicKey, `hex`)

        return format_signature(
            signatureBuffer,
            pubKeyBuffer
        )
    } catch (e) {
        console.error(tag, "e: ", e);
        return {};
    }
}

export async function createSignedTx(tx: any, signature: any) {
    if(!tx.signatures) tx.signatures = []
    tx.signatures = [signature]
    return tx
}

const create_sign_message = async function(jsonTx: any, sequence: string, account_number: string, chain_id: string){
    let tag = " | create_sign_message | "
    try{
        //{ sequence, account_number, chain_id }

        // sign bytes need amount to be an array
        const fee:any = {
            amount: jsonTx.fee.amount || [],
            gas: jsonTx.fee.gas
        }

        return JSON.stringify(
            prepareSignBytes({
                //@ts-ignore
                fee,
                memo: jsonTx.memo,
                msgs: jsonTx.msg, // weird msg vs. msgs
                sequence,
                account_number,
                chain_id
            })
        )

    }catch(e){
        console.error(e)
        throw Error(e)
    }
}

let prepareSignBytes = function (jsonTx: any):any {
    if (Array.isArray(jsonTx)) {
        return jsonTx.map(prepareSignBytes)
    }

    // string or number
    if (typeof jsonTx !== `object`) {
        return jsonTx
    }

    const sorted:any = {}
    Object.keys(jsonTx)
        .sort()
        .forEach(key => {
            if (jsonTx[key] === undefined || jsonTx[key] === null) return
            sorted[key] = prepareSignBytes(jsonTx[key])
        })
    return sorted
}

const sign_with_privkey = async function(signMessage: string, privateKey: any | { valueOf(): string; } | { [Symbol.toPrimitive](hint: "string"): string; }){
    let tag = " | sign_with_privkey | "
    try{
        if(!signMessage) throw Error("signMessage required!")

        const signature = (typeof privateKey.sign === "function" ? privateKey.sign(signMessage) : (() => {
            const signHash = Buffer.from(sha256(signMessage).toString(), `hex`);
            return secp256k1.sign(signHash, Buffer.from(privateKey, `hex`)).signature;
        })());
        return signature

    }catch(e){
        console.error(e)
        throw Error(e)
    }
}

// signature, sequence, account_number, publicKey
const format_signature = async function(signature: { toString: (arg0: string) => any; }, publicKey: Buffer){
    let tag = " | format_signature | "
    try{

        return {
            signature: signature.toString(`base64`),
            pub_key: {
                type: `tendermint/PubKeySecp256k1`, // TODO: allow other keyprpess
                value: publicKey.toString(`base64`)
            }
        }

    }catch(e){
        console.error(e)
        throw Error(e)
    }
}
