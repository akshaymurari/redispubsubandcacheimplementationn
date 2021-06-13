const {Sequelize,DataTypes} = require("sequelize");

const sequelize = new Sequelize("messaging","root","akshaymurari",{
    host:"localhost",
    dialect:"mysql"
});

sequelize.authenticate().then(()=>{
    console.log("connected to mysql");
}).catch(()=>{
    console.log("connection error mysql");
});

const db = {}

db.chats = require("../model/chats")(sequelize,DataTypes);

sequelize.sync().then(()=>{
    console.log("sync done");
}).catch(()=>{
    console.log("sync failed");
})

module.exports = db;