const UsuarioSeeder = require('./usuario.seeder');
const RolSeeder = require('./rol.seeder');
const CompanySeeder = require('./company.seeder');
const EmployeeSeeder = require('./employee.seeder');


const Seeder = async () => {
    await Promise.all(
        [
            RolSeeder(),
            UsuarioSeeder(),
            CompanySeeder(5),
            EmployeeSeeder(5)
        ]
    );
}

module.exports = Seeder;