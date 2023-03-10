const { DataTypes } = require('sequelize');
const Db = require('../config/db.config');

const Address = Db.define('Address', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
},{tableName:'addresses'});

module.exports = Address;


