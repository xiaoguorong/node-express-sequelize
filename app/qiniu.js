var express = require('express');
var qiniu = require('qiniu')
var constants = require("./../modular/constants")
var router = express.Router(); 
let accessKey = constants.access_key;
let secretKey = constants.secret_key;
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
let options = {
  scope: constants.bucket //七牛资源目录
};
let putPolicy = new qiniu.rs.PutPolicy(options);
let uploadToken = putPolicy.uploadToken(mac);
router.get("/qiniu/token",async (req,res)=>{
    res.send(uploadToken)
})
module.exports=router