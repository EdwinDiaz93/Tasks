const { Sequelize } = require('sequelize');


const Db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging:false,        
    define: {
        freezeTableName: false,
        timestamps: false,
        underscored:true,

    }
});


module.exports = Db;