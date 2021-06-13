module.exports = (sequelize,DataTypes) => {
    return sequelize.define("chat",{
        user1:{
            type:DataTypes.STRING
        },
        user2:{
            type:DataTypes.STRING
        },
        message:{
            type:DataTypes.STRING
        }
    });
}