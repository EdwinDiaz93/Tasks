const { usuarioData } = require('../data');
const Db = require('../models');

const UsuarioSeeder = async () => {
    await Db.model('Usuario').destroy({ where: {} });

    Db.model('Usuario').bulkCreate(usuarioData).then(
        (usuarios) => {
            usuarios.forEach(usuario => (
                usuario.setRols(Math.ceil(Math.random() * 3))
            ))
        }
    );
}

module.exports = UsuarioSeeder;