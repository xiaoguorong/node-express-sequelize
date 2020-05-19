var mysql = require("mysql")
var db_config = {
  host:'localhost',
  user:'root',
  password:'root',
  port:"3306",
  database:'car'
}

let pool=mysql.createPool(db_config);
  

// function connect(){
//   connection.connect((function(err) {
//     if(err){
//         console.log("连接失败")
//     }
//   })
//   )
// }
// function query(addSql,addSqlParams,fn){
//   connection.query(addSql,addSqlParams,fn)
// }
// function end(){
//   connection.end();
// }

module.exports=pool
