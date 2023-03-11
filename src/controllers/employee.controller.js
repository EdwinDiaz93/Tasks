const { request, response } = require('express');
const Db = require('../models');
const bcryptjs = require('bcryptjs');


class EmployeeController {

    static async getEmployees(req = request, res = response) {
        try {

            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const company = await Db.model('Company').findOne({ where: { usuario_id: req.usuario.id } });

            const { count, rows } = await Db.model('Employee').findAndCountAll({
                offset,
                limit,
                order: [['id', 'DESC']],
                where: { company_id: company.id },
                attributes: { exclude: ['UsuarioId', 'AddressId', 'CompanyId'] }
            });

            const from = offset + 1;
            const to = limit * page;
            const lastPage = Math.ceil(count / limit);

            const employees = {
                totalrows: count,
                firstPage: 1,
                lastPage,
                from,
                to,
                rows,
            }

            return res.status(200).json(employees);



        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Internal Server Error',
            })
        }
    }
    static async getEmployee(req = request, res = response) {
        try {

            const { id } = req.params;

            const company = await Db.model('Company').findOne({ where: { usuario_id: req.usuario.id } });

            const employee = await Db.model('Employee').findOne({
                where: { id, company_id: company.id },
                attributes: { exclude: ['UsuarioId', 'CompanyId'] }
            });

            if (!employee)
                return res
                    .status(404)
                    .json({ ok: false, msg: `employee with id ${id} not found` });

            const address = await employee.getAddress();

            return res.json({
                ...employee.toJSON(),
                AddressId: address.toJSON(),
            });


        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Internal Server Error',
            })
        }
    }
    static async saveEmployee(req = request, res = response) {
        try {
            const {
                first_name, last_name, salary, phone, slug,
                country, state, city, address, email, password
            } = req.body;

            const [usuario, employee] = await Promise.all(
                [
                    Db.model('Usuario').findOne({ where: { email } }),
                    Db.model('Employee').findOne({ where: { slug } })
                ]
            );

            if (usuario)
                return res.status(400).json({
                    ok: false,
                    msg: 'Email already taken'
                });

            if (employee)
                return res.status(400).json({
                    ok: false,
                    msg: 'Slug already taken'
                });

            const employeeDb = await Db.model('Employee').create({
                first_name,
                last_name,
                salary,
                phone,
                slug
            });

            const [addressDb, usuarioDb, company] = await Promise.all([
                Db.model('Address').create({
                    country,
                    state,
                    city,
                    address,
                }),
                Db.model('Usuario').create({
                    email,
                    password: bcryptjs.hashSync(password, bcryptjs.genSaltSync(10)),
                }),
                Db.model('Company').findOne({ where: { usuario_id: req.usuario.id } }),
            ]);

            usuarioDb.setRols(3);
            employeeDb.setCompany(company);
            employeeDb.setAddress(addressDb);
            employeeDb.setUsuario(usuarioDb);

            return res.status(201).json({
                ok: true,
                msg: 'Employee created'
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Internal Server Error',
            })
        }
    }
    static async updateEmployee(req = request, res = response) {
        try {
            const { first_name, last_name, salary, phone, slug, country, state, city, address, email, password } = req.body;
            const { id } = req.params;

            const company = await Db.model('Company').findOne({ where: { usuario_id: req.usuario.id } })

            const employee = await Db.model('Employee').findOne({ where: { id, company_id: company.id } });

            if (!employee)
                return res.status(404).json({
                    ok: false,
                    msg: `Employee with id ${id} not found`,
                });

            const [usuario, usuarioEmail, employeeSlug] = await Promise.all([
                employee.getUsuario(),
                Db.model('Usuario').findOne({ where: { email } }),
                Db.model('Employee').findOne({ where: { slug } })]
            );

            if (employeeSlug && employee.slug !== employeeSlug.slug)
                return res.status(400).json({ ok: false, msg: 'There is another employee with this slug' });

            if (usuarioEmail && usuario.email !== usuarioEmail.email)
                return res.status(400).json({ ok: false, msg: 'There is another employee with this email' });

            const employeeUpdate = await employee.update({
                first_name,
                last_name,
                salary,
                phone,
                slug,
            });

            await Promise.all([
                Db.model('Usuario').update({
                    email,
                    password: bcryptjs.hashSync(password, bcryptjs.genSaltSync(10)),
                }, {
                    where: { id: employeeUpdate.UsuarioId }
                }),

                Db.model('Address').update({
                    country,
                    state,
                    city,
                    address,
                }, {
                    where: { id: employeeUpdate.AddressId }
                }),

            ]);

            return res.status(200).json({
                ok: true,
                msg: 'employee updated'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Internal Server Error',
            })
        }
    }
    static async deleteEmployee(req = request, res = response) {
        try {
            const { id } = req.params;
            const company = await Db.model('Company').findOne({ where: { usuario_id: req.usuario.id } });

            const employee = await Db.model('Employee').findOne({ where: { id, company_id: company.id } });

            if (!employee)
                return res.status(404).json({
                    ok: false,
                    msg: `employee with id ${id} not found`,
                });

            await Promise.all([
                Db.model('Usuario').destroy({ where: { id: employee.UsuarioId } }),
                Db.model('Address').destroy({ where: { id: employee.AddressId } }),
            ]);
            employee.destroy();


            res.status(204).json({
                ok: true,
                msg: 'employee deleted',
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Internal Server Error',
            })
        }
    }
}


module.exports = EmployeeController;