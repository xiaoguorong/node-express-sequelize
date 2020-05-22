var Sequelize = require("sequelize")
var sequelize = require("../config")
const user = sequelize.define('c_user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    mobile:Sequelize.INTEGER,
    token:Sequelize.STRING,
    create_time: Sequelize.INTEGER,
    expire_time: Sequelize.INTEGER,
}, {
    freezeTableName: true,//不修改表名
    timestamps: false,//是否自动添加时间戳createAt，updateAt
});
module.exports = user     