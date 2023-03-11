const { request, response } = require('express');
const { verifyToken } = require('../helpers/jwt');
const validateToken = async (req = request, res = response, next) => {

    const token = req.headers.authorization && req.headers.authorization.split(' ').pop();

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Token not found',
        });
    }

    try {

        const usuario = await verifyToken(token);
        req.usuario = usuario;
        next();
    } catch (error) {
        if (error && error.expiredAt) {
            return res.status(400).json({
                ok: false,
                msg: `Token expirado ${error.expiredAt}`,
            })
        }
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error validando el token'
        })
    }

}

module.exports = validateToken;