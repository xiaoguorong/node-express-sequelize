var crypto = require('crypto');

function createToken(uid){
    var d= Math.floor(Date.parse(new Date())/1000)
    var r = Math.random()*89999999+10000000;
    var preStr = 'c'+r+d+uid;
    var sha=crypto.createHash('sha512');//可以用console.log(crypto.getHashes());查看支持哪些加密方式
    return sha.update(preStr).digest("base64");
}

module.exports = createToken
 