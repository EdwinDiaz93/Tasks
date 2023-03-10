const { request, response } = require('express')
const { compareSync } = require('bcryptjs')
const { generateToken } = require('../helpers/jwt');

const Db = require('../models');


class AuthController {
    static async login(req = request, res = response) {
        const { email, password } = req.body;

        const usuario = await Db.model('Usuario').findOne({ where: { email } });

        if (!usuario)
            return res.status(400).json({ ok: false, msg: 'Credenciales invalidas' });


        if (!compareSync(password, usuario.password))
            return res.status(400).json({ ok: false, msg: 'Credenciales invalidas' });

        const { id, username, email: usuarioEmail } = usuario;

        const rolesDb = await usuario.getRols();

        // tansformar los roles para solo acceder al nombre del rol
        const roles = rolesDb ? rolesDb.map(rol => ({ name: rol.name })) : [];

        const token = await generateToken({ id, username, email: usuarioEmail, roles });

        return res.status(200).json({
            ok: true,
            id,
            username,
            email,            
            token,
        })

    }

    static async refresh(req = request, res = response) {
        const { usuario: { id, username, email } } = req;

        const token = await generateToken({ id, username, email });

        return res.status(200).json({
            id,
            username,
            email,
            token,
        })

    }
}

module.exports = AuthController;