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
            const { slug } = req.params;
            const company = await Db.model('Company').findOne({
                where: { slug },
                attributes: { exclude: ['UsuarioId',] }
            });
            if (!company)
                return res
                    .status(404)
                    .json({ ok: false, msg: `company with slug ${slug} not found` });

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
    static saveCompany(req = request, res = response) {
        try {
            const { name, owner_name, slug, summary, country, state, city, address, email, password } = req.body;
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
                msg: 'Compañia creada correctamente'
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
            return res.json({
                ...req.body
            })
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