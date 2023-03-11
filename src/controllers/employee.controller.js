const { request, response } = require('express');
const Db = require('../models');
const bcryptjs = require('bcryptjs');


class EmployeeController {

    static async getEmployees(req = request, res = response) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;
            const { count, rows } = await Db.model('Employee').findAndCountAll({
                offset,
                limit,
                attributes: { exclude: ['UsuarioId', 'AddressId'] }
            });

            const from = offset + 1;
            const to = limit * page;
            const lastPage = Math.ceil(count / limit);

            const companies = {
                totalrows: count,
                firstPage: 1,
                lastPage,
                from,
                to,
                rows,
            }

            return res.status(200).json(companies);
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
            const employee = await Db.model('Employee').findByPk(id, {
                attributes: { exclude: ['UsuarioId'] }
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
            const { first_name, last_name, salary, phone, slug, country, state, city, address, email, password } = req.body;

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

            Db.model('Employee').create({
                first_name,
                last_name,
                salary,
                phone,
                slug,
            }).then(async (employee) => {
                const [addr, usuario] = await Promise.all([
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
                ]);
                usuario.setRols(3);
                employee.setAddress(addr);
                employee.setUsuario(usuario);
            });
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

            const employee = await Db.model('Employee').findByPk(id);

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

            employee.update({
                first_name,
                last_name,
                salary,
                phone,
                slug,
            }).then(async (employee) => {
                const [usuario, addr] = await Promise.all([
                    employee.getUsuario(),
                    employee.getAddress(),
                ]);

                await Promise.all([
                    usuario.update({
                        email,
                        password: bcryptjs.hashSync(password, bcryptjs.genSaltSync(10)),
                    }),
                    addr.update({
                        country,
                        state,
                        city,
                        address,
                    }),
                ]);

            });

            return res.status(200).json({
                ok: true,
                msg: 'Compañia actualizada correctamente'
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
            const company = await Db.model('Company').findByPk(id);

            if (!company)
                return res.status(404).json({
                    ok: false,
                    msg: `compañia con id: ${id} no encontrada`
                });
            const [usuario, address] = await Promise.all([
                company.getUsuario(),
                company.getAddress(),
            ]);

            if (usuario) await usuario.destroy();
            if (address) await address.destroy();

            await company.destroy();

            res.status(204).json({
                ok: true,
                msg: 'Compania eliminada correctamente',
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