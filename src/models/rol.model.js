const { DataTypes } = require('sequelize');
const Db = require('../config/db.config');

const Rol = Db.define('Rol', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
},{tableName:'roles'});

module.exports = Rol;


