var Sequelize = require("sequelize")
var sequelize = require("../config")
const goods = sequelize.define('c_goods', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    uid: Sequelize.INTEGER,
    name: Sequelize.STRING,
    count:Sequelize.INTEGER,
    status: Sequelize.BOOLEAN,
    create_time: Sequelize.INTEGER,
    update_time: Sequelize.INTEGER,
}, {
    freezeTableName: true,//不修改表名
    timestamps: false,//是否自动添加时间戳createAt，updateAt
});
module.exports = goods