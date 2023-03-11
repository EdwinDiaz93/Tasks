const { faker } = require('@faker-js/faker');
const bcryptjs = require('bcryptjs');
const Db = require('../models');

const CompanySeeder = async (totalRows) => {



    for (let index = 0; index < totalRows; index++) {
        Db.model('Employee').create({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            salary: faker.datatype.float({ min: 500, max: 3000, precision: 2 }),
            phone: faker.phone.number('####-####'),
            slug: faker.helpers.slugify(faker.name.fullName()),
        }).then(
            async (employee) => {
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
                usuario.setRols(3);
                employee.setCompany(Math.ceil(Math.random() * totalRows))
                employee.setAddress(address);
                employee.setUsuario(usuario);
            }
        );


    }


    await Db.model('Company').destroy({ where: {} });
    await Db.model('Address').destroy({ where: {} });
}

module.exports = CompanySeeder;