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
    const usuario = await verifyToken(token);    
    req.usuario = usuario;
    next();
}

module.exports = validateToken;