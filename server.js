var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var router = require('./app/index')
var qiniuRouter = require('./app/qiniu')
var app = express(); 
app.use(bodyParser.json());//不引入的话post请求无法解析传过来的对象
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router)
app.use(qiniuRouter)
app.listen(1234)