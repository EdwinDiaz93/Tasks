const Db = require('../models');
const { rolData } = require('../data');
const RolSeeder = async () => {


    await Db.model('Rol').destroy({ where: {} });
    await Db.model('Rol').bulkCreate(rolData);
}

module.exports = RolSeeder;