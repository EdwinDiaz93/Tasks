const Db = require('../config/db.config');
const Usuario = require('./usuario.model');
const Rol = require('./rol.model');
const Address = require('./address.model');
const Company = require('./company.model');
const Employee = require('./employee.model');

// Relaciones de usuario rol
Usuario.belongsToMany(Rol, { through: 'usuario_rol' })
Rol.belongsToMany(Usuario, { through: 'usuario_rol' })

// Relacion compañia y usuario
Usuario.hasOne(Company);
Company.belongsTo(Usuario)


// Relacion empleado y usuario
Usuario.hasOne(Employee);
Employee.belongsTo(Usuario)

// Relarciones compañia y direccion
Company.belongsTo(Address);
Address.hasOne(Company);

// Relarciones empleado y direccion
Employee.belongsTo(Address);
Address.hasOne(Employee);

// Relacion empleado compañia

Company.hasMany(Employee, { onDelete: 'CASCADE' });
Employee.belongsTo(Company, { onDelete: 'CASCADE' });


const models = {
    Usuario,
    Rol,
    Address,
    Company,
    Employee,
}

Db.models = { ...models };


module.exports = Db;





