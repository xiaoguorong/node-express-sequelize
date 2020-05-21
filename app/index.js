var express = require('express');
var models = require('./../sequelize')
var constants = require("./../modular/constants")
var request = require('request')
var decrypt = require('./../modular/decrypt')
var createToken = require('./../modular/createToken')
var router = express.Router(); 
//findOne  return {}
//update return 0失败 1成功

router.get("/a",async (req,res)=>{
	var a = await models.user.findAll();
    res.send(a)
})
router.post("/add/customer",async (req,res)=>{
	const imgList = req.body.imgList;
	var data = [];
	imgList.forEach(element => {
		data.push({
			qnkey: element,
			status: 1,
			uid: 1,
			create_time:Date.parse(new Date())/1000,
			update_time:Date.parse(new Date())/1000
		})
	});
	var list = await models.data_bank.bulkCreate(data);
	var databank_id = list.map(e=>{
		return e.id
	})
	var list = await models.customer.create({
		code: req.body.code,
		province: req.body.province,
		mobile: req.body.mobile,
		type: req.body.type.join(","),
		price: req.body.price,
		date: req.body.date,
		content: req.body.content,
		databank_id: databank_id.join(","),
		status:1,
		created_time: Date.parse(new Date())/1000,
		update_time: Date.parse(new Date())/1000
	})
	res.send(list)

})
router.put("/add/customer",async (req,res)=>{
	const imgList = req.body.imgList;
	var data = [];
	imgList.forEach(element => {
		data.push({
			qnkey: element,
			status: 1,
			uid: 1,
			create_time:Date.parse(new Date())/1000,
			update_time:Date.parse(new Date())/1000
		})
	});
	var list = await models.data_bank.bulkCreate(data);
	var databank_id = list.map(e=>{
		return e.id
	})
	var list = await models.customer.update(
		{
			code: req.body.code,
			province: req.body.province,
			mobile: req.body.mobile,
			type: req.body.type.join(","),
			price: req.body.price,
			date: req.body.date,
			content: req.body.content,
			databank_id: databank_id.join(","),
			update_time: Date.parse(new Date())/1000
		}, {
   
		  'where': { id: 2 }
		}
	  )
	res.send(list)

})
router.delete("/add/customer",async (req,res)=>{
	await models.customer.update(
		{	status:-1,
			update_time: Date.parse(new Date())/1000
		}, {
   
		  'where': { id: 2 }
		}
	  )
	res.send("ppp")

})

router.get("/getSessionKey",(req,res)=>{
	var APP_URL='https://api.weixin.qq.com/sns/jscode2session'
	request(`${APP_URL}?appid=${constants.app_id}&secret=${constants.app_secret}&js_code=${req.query.code}&grant_type=authorization_code`, (error, response, body)=>{
		res.end(body)
	})  
})
router.post("/getMobile",async (req,res)=>{
	//encrypt里面包含+或者其他符号，可能buffer报错违法，所以前端编码一下后端解码一下
	var data = decrypt(constants.app_id, decodeURIComponent(req.body.sessionKey),decodeURIComponent(req.body.encrypt) , decodeURIComponent(req.body.iv))
	var mobile = data.phoneNumber;
	var detail = await models.user.findOne({
		where: {
			mobile
		}
	}) 
	if(detail){
		var token = createToken(detail.id)
		var list = await models.user.update(
		{
			token,
			expire_time:Date.parse(new Date())/1000+2592000
		}, {
	
			'where': { id: detail.id }
		}
		)
	}else{
		var token = createToken(detail.id)
		var list = await models.user.create({
			mobile,
			token,
			created_time: Date.parse(new Date())/1000,
			update_time: Date.parse(new Date())/1000+2592000
		})
		console.log(list)
		res.send(list)
	}
	// var list = await models.customer.create({
	// 	code: req.body.code,
	// 	province: req.body.province,
	// 	mobile: req.body.mobile,
	// 	type: req.body.type.join(","),
	// 	price: req.body.price,
	// 	date: req.body.date,
	// 	content: req.body.content,
	// 	databank_id: databank_id.join(","),
	// 	status:1,
	// 	created_time: Date.parse(new Date())/1000,
	// 	update_time: Date.parse(new Date())/1000
	// })
	res.send("sss")
})

module.exports=router