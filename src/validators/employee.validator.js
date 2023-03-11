const { body } = require('express-validator');

const EmployeeValidator = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('El campo email es obligatorio')
        .isEmail()
        .withMessage('Debe proveer un email valido'),
    body('password')
        .not()
        .isEmpty()
        .withMessage('El campo password es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El campo password debe tener minimo 3 caracteres'),
    body('first_name')
        .not()
        .isEmpty()
        .withMessage('El campo first_name es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo name debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
    body('last_name')
        .not()
        .isEmpty()
        .withMessage('El campo last_name es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo last_name debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
    body('salary')
        .not()
        .isEmpty()
        .withMessage('El campo salary es obligatorio')
        .isFloat({ min: 0 })
        .withMessage('El campo salary debe ser un numero con decimal mayor a cero'),
    body('phone')
        .not()
        .isEmpty()
        .withMessage('El campo phone es obligatorio'),
    body('slug')
        .not()
        .isEmpty()
        .withMessage('El campo slug es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo slug debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
    body('country')
        .not()
        .isEmpty()
        .withMessage('El campo country es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo country debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
    body('state')
        .not()
        .isEmpty()
        .withMessage('El campo state es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo state debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
    body('city')
        .not()
        .isEmpty()
        .withMessage('El campo city es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo city debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
    body('address')
        .not()
        .isEmpty()
        .withMessage('El campo address es obligatorio')
        .isLength({ min: 1, max: 100 })
        .withMessage('El campo address debe tener minimo 1 caracter y maximo 100 incluyendo espacios')
];
module.exports = EmployeeValidator;