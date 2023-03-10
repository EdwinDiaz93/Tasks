const { DataTypes } = require('sequelize');
const Db = require('../config/db.config');

const Company = Db.define('Company', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    summary: {
        type: DataTypes.STRING,
        allowNull: false,        
    },
}, { tableName: 'companies' });

module.exports = Company;


