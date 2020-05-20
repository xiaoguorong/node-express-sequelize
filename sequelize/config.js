var Sequelize = require("sequelize")
var sequelize = new Sequelize('car', 'root', 'root',  {  
  host: 'localhost',  
  dialect: 'mysql', 
});
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch(err => {
    console.error('数据库连接失败', err);
  });

// var db_config = {
//   host:'localhost',
//   user:'root',
//   password:'root',
//   port:"3306",
//   database:'car'
// }

// let pool=mysql.createPool(db_config);
  

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

module.exports=sequelize
