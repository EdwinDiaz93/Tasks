const UsuarioSeeder = require('./usuario.seeder');
const RolSeeder = require('./rol.seeder');
const CompanySeeder = require('./company.seeder');
const EmployeeSeeder = require('./employee.seeder');


const Seeder = async () => {
    const size = 50;
    await Promise.all(
        [
            RolSeeder(),
            UsuarioSeeder(),
            CompanySeeder(size),
            EmployeeSeeder(size)
        ]
    );
}

module.exports = Seeder;