var express = require('express');
var statement = require('./../mysql/sql.js')
var pool = require('./../mysql/pool.js')
var router = express.Router(); 
router.get("/a",function(req,res){
    pool.getConnection(function(err,connect){//通过getConnection()方法进行数据库连接
       	connect.query(statement.getOne('user'),1,function(err,result){
			if(result){
				res.send(result)
				connect.release();//释放连接池中的数据库连接
			}
		})
	})
});
router.post("/a",function(req,res){
  res.send(req.body)
})
module.exports=router