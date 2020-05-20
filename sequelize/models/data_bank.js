var Sequelize = require("sequelize")
var sequelize = require("../config")
const data_bank = sequelize.define('c_data_bank', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,         
        autoIncrement: true, 
    },
    qnkey: Sequelize.STRING,
    status: Sequelize.BOOLEAN,
    uid: Sequelize.INTEGER,
    create_time: Sequelize.INTEGER,
    update_time: Sequelize.INTEGER,
}, {
    freezeTableName: true,//不修改表名
    timestamps: false,//是否自动添加时间戳createAt，updateAt
});
module.exports = data_bank