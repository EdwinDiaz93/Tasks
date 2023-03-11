const { request, response } = require('express');
const Db = require('../models');
const bcryptjs = require('bcryptjs');


class CompanyController {

    static async getCompanies(req = request, res = response) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;
            const { count, rows } = await Db.model('Company').findAndCountAll({
                offset,
                limit,
                order: [['id', 'DESC']],
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
    static async getCompany(req = request, res = response) {
        try {
            const { id } = req.params;
            const company = await Db.model('Company').findByPk(id, {
                attributes: { exclude: ['UsuarioId'] }
            });
            if (!company)
                return res
                    .status(404)
                    .json({ ok: false, msg: `company with id ${id} not found` });

            const address = await company.getAddress();

            return res.json({
                ...company.toJSON(),
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
    static async saveCompany(req = request, res = response) {
        try {
            const { name, owner_name, slug, summary, country, state, city, address, email, password } = req.body;

            const [usuario, company] = await Promise.all(
                [
                    Db.model('Usuario').findOne({ where: { email } }),
                    Db.model('Company').findOne({ where: { slug } })
                ]
            );

            if (usuario)
                return res.status(400).json({
                    ok: false,
                    msg: `The email ${email} already taken`
                });

            if (company)
                return res.status(400).json({
                    ok: false,
                    msg: `The slug ${slug} already taken`,
                });

            Db.model('Company').create({
                name,
                owner_name,
                slug,
                summary
            }).then(async (company) => {
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
                usuario.setRols(2);
                company.setAddress(addr);
                company.setUsuario(usuario);
            });
            return res.status(201).json({
                ok: true,
                msg: 'Company created'
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Internal Server Error',
            })
        }
    }
    static async updateCompany(req = request, res = response) {
        try {
            const { name, owner_name, slug, summary, country, state, city, address, email, password } = req.body;
            const { id } = req.params;
            const company = await Db.model('Company').findByPk(id);

            if (!company)
                return res.status(404).json({
                    ok: false,
                    msg: `Company with id ${id} not found`,
                });

            const [usuario, usuarioEmail, companySlug] = await Promise.all([
                company.getUsuario(),
                Db.model('Usuario').findOne({ where: { email } }),
                Db.model('Company').findOne({ where: { slug } })]
            );

            if (companySlug && company.slug !== companySlug.slug)
                return res.status(400).json({ ok: false, msg: 'There is another company with this slug' });

            if (usuarioEmail && usuario.email !== usuarioEmail.email)
                return res.status(400).json({ ok: false, msg: 'There is another company with this email' });

            company.update({
                name,
                owner_name,
                slug,
                summary,
            }).then(async (company) => {

                await Promise.all([
                    Db.model('Usuario').update({
                        email,
                        password: bcryptjs.hashSync(password, bcryptjs.genSaltSync(10)),
                    }, {
                        where: { id: company.UsuarioId }
                    }),

                    Db.model('Address').update({
                        country,
                        state,
                        city,
                        address,
                    }, {
                        where: { id: company.AddressId }
                    }),
                ]);

            });

            return res.status(200).json({
                ok: true,
                msg: 'Company updated'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Internal Server Error',
            })
        }
    }
    static async deleteCompany(req = request, res = response) {
        try {
            const { id } = req.params;
            const company = await Db.model('Company').findByPk(id);

            if (!company)
                return res.status(404).json({
                    ok: false,
                    msg: `Company with id ${id} not found`
                });

            await Promise.all([
                Db.model('Address').destroy({ where: { id: company.AddressId } }),
                Db.model('Usuario').destroy({ where: { id: company.UsuarioId } }),
            ]);


            await company.destroy();

            res.status(204).json({
                ok: true,
                msg: 'Company deleted',
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


module.exports = CompanyController;