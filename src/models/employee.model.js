const { DataTypes } = require('sequelize');
const Db = require('../config/db.config');

const Employee = Db.define('Employee', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salary: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    phone: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, { tableName: 'employees' });

module.exports = Employee;


