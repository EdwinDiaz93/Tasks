const { DataTypes } = require('sequelize');
const Db = require('../config/db.config');

const Usuario = Db.define('Usuario', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{tableName:'usuarios'});

module.exports = Usuario;


