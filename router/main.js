"use strict";

const config      = require('../config');
const bitcoin_rpc = require('node-bitcoin-rpc');
bitcoin_rpc.init(config.host, config.port, config.user, config.pass)


module.exports = async function (app)
{

    app.get('/getBlockHash/:blockNumber', async function(req, res) {
        try {
            let _blockNumber = req.params.blockNumber;
            let _blockHash   = await getBlockHash(_blockNumber);
            let block        = await getBlock(_blockHash);
            res.end(block);
        } catch (e) {
            res.end(e);
        }
    });


    app.get('/getBlockTransaction/:blockNumber', async function(req, res) {
        try {
            let _blockNumber = req.params.blockNumber;
            let rsList       = await fn_gate(_blockNumber);
            res.json(rsList);
        } catch (e) {
            res.end(e);
        }
    });

}

var fn_gate = async (_blockNumber) => {
    try {
        let blockHash       = await getBlockHash(_blockNumber);
        let block           = await getBlock(blockHash);
        let hash            = JSON.parse(block);
        let txHash          = hash.tx;
        let resultList      = [];
        for(let i = 0; i < txHash.length; i++) {
            let rawTransaction  = await getRawTransaction(txHash[i]);
            let decodeRaw       = await getDecodeRaw(rawTransaction);
            let txList          = {};
            txList.txid = null;
            txList.vout = null;
            if(decodeRaw.txid != undefined) {
                txList.txid = decodeRaw.txid;
            }
            if(decodeRaw.vout != undefined) {
                let valueList = decodeRaw.vout;
                txList.vout   = await fn_getVout(valueList);
            }
            resultList.push(txList);
        }
        return resultList;
    } catch (error) {
        reject(error);
    }
}

var fn_getVout = async function(valueList) {
    return new Promise(function (resolve, reject) {
        try {
            let voutList = [];
            for (let i = 0; i < valueList.length; i++) {
                let scriptPkeyList          = {};
                scriptPkeyList.value        = null;
                scriptPkeyList.hex          = null;
                scriptPkeyList.addresses    = null;
                if(valueList[i].value != undefined){
                    scriptPkeyList.value = valueList[i].value;
                }
                if(valueList[i].scriptPubKey != undefined && valueList[i].scriptPubKey.hex != undefined){
                    scriptPkeyList.hex = valueList[i].scriptPubKey.hex;
                }
                if(valueList[i].scriptPubKey != undefined && valueList[i].scriptPubKey.addresses != undefined){
                    scriptPkeyList.addresses = valueList[i].scriptPubKey.addresses;
                }
                voutList.push(scriptPkeyList);
            }
            resolve(voutList);
        } catch (error) {
            reject(error);
        }
    }).catch(e => console.log(e));
}

let getBlockHash = async function(_blockNumber) {
    return new Promise(function (resolve, reject) {
        bitcoin_rpc.call('getblockhash', [Number(_blockNumber)], function (err, res) {
            if (err) {
                reject(err)
            } else if (res.error) {
                reject(res.error)
            } else {
                resolve(res.result);
            }
        })
    }).catch(e => console.log(e));
};

var getBlock = async function(_blockHash) {
    return new Promise(function (resolve, reject) {
        bitcoin_rpc.call('getblock', [_blockHash], function (err, res) {
            if (err) {
                reject(err)
            } else if (res.error) {
                reject(res.error)
            } else {
              resolve(JSON.stringify(res.result));
            }
        })
    }).catch(e => console.log(e));
}

var getRawTransaction = async function(_hashTx) {
    return new Promise(function (resolve, reject) {
        bitcoin_rpc.call('getrawtransaction', [_hashTx], function (err, res) {
            if (err) {
                reject(err)
            } else if (res.error) {
                reject(res.error)
            } else {
              resolve(res.result);
            }
        })
    }).catch(e => console.log(e));
}


var getDecodeRaw = async function(_rawTransaction) {
    return new Promise(function (resolve, reject) {
        bitcoin_rpc.call('decoderawtransaction', [_rawTransaction], function (err, res) {
            if (err) {
                reject(err)
            } else if (res.error) {
                reject(res.error)
            } else {
                resolve(res.result);
            }
        })
    }).catch(err => console.log(err));
}


