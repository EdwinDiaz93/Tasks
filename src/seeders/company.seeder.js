const { faker } = require('@faker-js/faker');
const bcryptjs = require('bcryptjs');
const Db = require('../models');

const CompanySeeder = async (totalRows) => {



    for (let index = 0; index < totalRows; index++) {

        Db.model('Company').create({
            name: faker.company.name(),
            owner_name: faker.name.fullName(),
            slug: faker.helpers.slugify(faker.name.fullName()),
            summary: faker.lorem.sentence(10),
        }).then(
            async (company) => {
                const [address, usuario] = await Promise.all(
                    [
                        Db.model('Address').create({
                            country: faker.address.country(),
                            state: faker.address.state(),
                            city: faker.address.city(),
                            address: faker.address.streetAddress(),
                        }),
                        Db.model('Usuario').create({
                            email: faker.internet.email(),
                            password: bcryptjs.hashSync('12345', bcryptjs.genSaltSync(10)),
                        })
                    ]);
                usuario.setRols(2);
                company.setAddress(address);
                company.setUsuario(usuario);
            }
        );


    }


    await Db.model('Company').destroy({ where: {} });
    await Db.model('Address').destroy({ where: {} });
}

module.exports = CompanySeeder;