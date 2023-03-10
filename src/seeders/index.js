const UsuarioSeeder=require('./usuario.seeder');
const RolSeeder=require('./rol.seeder');


const Seeder = async () => {
    await RolSeeder();
    await UsuarioSeeder();
}

module.exports = Seeder;