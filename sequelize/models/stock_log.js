var Sequelize = require("sequelize")
var sequelize = require("../config")
const stock_log = sequelize.define('c_stock_log', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    uid: Sequelize.INTEGER,
    gid: Sequelize.INTEGER,
    name: Sequelize.STRING,
    count:Sequelize.INTEGER,
    price:Sequelize.INTEGER,
    date: Sequelize.STRING,
    status: Sequelize.BOOLEAN,
    content: Sequelize.STRING,
    create_time: Sequelize.INTEGER,
    update_time: Sequelize.INTEGER,
}, {
    freezeTableName: true,//不修改表名
    timestamps: false,//是否自动添加时间戳createAt，updateAt
});
module.exports = stock_log