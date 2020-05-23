var Sequelize = require("sequelize")
var sequelize = require("../config")
const customer = sequelize.define('c_customer', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    uid: Sequelize.INTEGER,
    code: Sequelize.STRING,
    car_type: Sequelize.STRING,
    province: Sequelize.STRING,
    mobile: Sequelize.STRING,
    type: Sequelize.STRING,
    price: Sequelize.INTEGER,
    date: Sequelize.STRING,
    content: Sequelize.STRING,
    databank_id: Sequelize.STRING,
    status: Sequelize.BOOLEAN,
    create_time: Sequelize.INTEGER,
    update_time: Sequelize.INTEGER,
}, {
    freezeTableName: true,//不修改表名
    timestamps: false,//是否自动添加时间戳createAt，updateAt
});
module.exports = customer