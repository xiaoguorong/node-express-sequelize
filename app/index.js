var express = require('express');
var models = require('./../sequelize')
var router = express.Router(); 
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
	await models.customer.destroy({

		where: {
		
		id:1
		
		}
	})
	res.send("ppp")

})

// router.post("/a",function(req,res){
//   res.send(req.body)
// })
module.exports=router