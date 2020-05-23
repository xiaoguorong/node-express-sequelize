var express = require('express');
var seq = require('sequelize');
var models = require('./../sequelize')
var constants = require("./../modular/constants")
var request = require('request')
var decrypt = require('./../modular/decrypt')
var createToken = require('./../modular/createToken')
var router = express.Router(); 
var returnData,uid; 
var Op = seq.Op;
//findOne  return {} findAll return []
//update return 0失败 1成功
//create return 添加的本条数据详情
//sum 求某字段的和，第一个参数字段名 第二个可以是where
router.use(async (req,res,next)=>{
	returnData = {
		code:'200',
		msg:'操作成功',
		content:{},
		token_info:{}
	}
	if(req.path == '/getSessionKey' ||req.path == '/getMobile'){
		next()
	}else{
		const token = req.headers.token;
		var detail = await models.user.findOne({
			where: {
				token
			}
		}) 
		if(detail){
			uid = detail.id;
			if(Date.parse(new Date())/1000 - detail.expire_time > 0){
				returnData.code = '385'
				returnData.msg = '登录过期'
				res.send(returnData)
			}else if(detail.expire_time - Date.parse(new Date())/1000 < 86400){
				const newToken = createToken(detail.id)
				const result = await models.user.update(
				{
					token:newToken,
					expire_time:Date.parse(new Date())/1000+2592000
				}, {
			
					'where': { id: detail.id }
				})
				if(result == 1){
					returnData.token_info.token = newToken;
					returnData.token_info.refresh_token = 1;
					next()
				}else{
					returnData.code = '385'
					returnData.msg = '登录过期'
					res.send(returnData)
				}
				
			}else{
				returnData.token_info.token = token;
				returnData.token_info.refresh_token = 0;
				next()
			}
		}else{
			returnData.code = '385'
			returnData.msg = '登录过期'
			res.send(returnData)
		}
	}
	
	
}) 
router.get("/customer/detail",async (req,res)=>{
	const detail = await models.customer.findOne({
		where:{
			uid,
			status:1,
			id:req.query.id
		}
	});
	returnData.content = detail
    res.send(returnData)
})
router.get("/customer/list",async (req,res)=>{
	const list = await models.customer.findAll({
		where:{
			uid,
			status:1,
			[Op.or]:{
				code:{
					[Op.like]: '%'+req.query.keyword+'%',
				},
				car_type:{
					[Op.like]: '%'+req.query.keyword+'%',
				}
			}
		}
	});
	returnData.content = list
    res.send(returnData)
})
router.get("/getCrm",async (req,res)=>{
	const customerCount = await models.customer.count({
		where:{
			uid,
			status:1,
			create_time:{
				[Op.gte]: req.query.start,
				[Op.lt]: req.query.end,
			}
		}
	});
	const goodsAddCount = await models.stock_log.sum('count',{
		where:{
			uid,
			status:1,
			count:{
				[Op.gt]: 0,
			},
			create_time:{
				[Op.gte]: req.query.start,
				[Op.lt]: req.query.end,
			}
		}
	});
	const goodsRemoveCount = await models.stock_log.sum('count',{
		where:{
			uid,
			status:1,
			count:{
				[Op.lt]: 0,
			},
			create_time:{
				[Op.gte]: req.query.start,
				[Op.lt]: req.query.end,
			}
		},
	});
	returnData.content.goodsAddCount = goodsAddCount ? goodsAddCount : 0;
	returnData.content.customerCount = customerCount;
	returnData.content.goodsRemoveCount = goodsRemoveCount ? goodsRemoveCount : 0;
    res.send(returnData)
})
router.get("/getData",async (req,res)=>{
	const customerCount = await models.customer.count({
		where:{
			uid,
			status:1
		}
	});
	const goodsCount = await models.goods.count({
		where:{
			uid,
			status:1
		}
	});
	const goodsAllCount = await models.goods.sum('count',{
		where:{
			uid,
			status:1
		},
	});
	returnData.content.goodsAllCount = goodsAllCount;
	returnData.content.customerCount = customerCount;
	returnData.content.goodsCount = goodsCount;
	console.log(returnData)
    res.send(returnData)
})
router.post("/add/goods",async(req,res)=>{
	var detail = await models.goods.findOne({
		where: {
			name:req.body.name
		}
	}) 
	if(!detail){
		await models.goods.create({
			uid,
			name: req.body.name,
			count: req.body.count,
			create_time: Date.parse(new Date())/1000,
			update_time: Date.parse(new Date())/1000
		}) 
		res.send(returnData)
	}else{
		returnData.code = 301;
		returnData.msg = '商品已存在'
		res.send(returnData)  
	}  
})
router.post("/add/stock",async(req,res)=>{
	var detail = await models.goods.findOne({
		where: {
			id:req.body.gid
		}
	}) 
	if(detail){
		await models.stock_log.create({
			uid,
			gid:req.body.gid,
			name: req.body.name,
			count: req.body.count,
			price: req.body.price,
			date: req.body.date,
			content: req.body.content,
			create_time: Date.parse(new Date())/1000,
			update_time: Date.parse(new Date())/1000
		})
		
		var result = await models.goods.update({
			count:parseInt(detail.count)+parseInt(req.body.count),
			update_time: Date.parse(new Date())/1000
		},{
			where:{
				id:req.body.gid
			}
		})
	}
	res.send(returnData)

})
router.get("/goodsList",async (req,res)=>{
	const result = await models.goods.findAll({
		where:{
			uid
		}
	});
	returnData.content = result;
    res.send(returnData)
})
router.post("/add/customer",async (req,res)=>{
	const imgList = req.body.imgList;
	var data = [];
	imgList.forEach(element => {
		data.push({
			qnkey: element,
			status: 1,
			uid,
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
		uid,
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
			uid,
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
		returnData.token_info.token = token;
		returnData.token_info.refresh_token = 1;
		res.send(returnData)
	}else{
		var token = createToken()
		var list = await models.user.create({
			mobile,
			token, 
			create_time: Date.parse(new Date())/1000,
			expire_time: Date.parse(new Date())/1000+2592000
		})
		returnData.token_info.token = token;
		returnData.token_info.refresh_token = 1;
		res.send(returnData)
	}
})

module.exports=router