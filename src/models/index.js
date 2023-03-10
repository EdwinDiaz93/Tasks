const Db = require('../config/db.config');
const Usuario = require('./usuario.model');
const Rol = require('./rol.model');

// Relaciones de usuario rol
Usuario.belongsToMany(Rol,{through:'usuario_rol'})
Rol.belongsToMany(Usuario,{through:'usuario_rol'})

const models = {
    Usuario,
    Rol,
}

Db.models = { ...models };


module.exports = Db;





