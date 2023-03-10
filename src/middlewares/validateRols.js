const { request, response } = require('express');

const validateRoles = (roles) => {
    
    return (req = request, res = response, next) => {        
        if (req.usuario.roles.some(
            rol =>
                roles.includes(rol.name))
        ) {
            next();
        }

        else {
            return res.status(403).json({ ok: false, msg: 'No tienes permisos para realizar esta accion' });
        }
    }
}

module.exports = validateRoles;