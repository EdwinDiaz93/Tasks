const { body } = require('express-validator');

const Db = require('../models');

const CompanyValidator = [
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
    body('name')
        .not()
        .isEmpty()
        .withMessage('El campo name es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo name debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
    body('owner_name')
        .not()
        .isEmpty()
        .withMessage('El campo owner name es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo owner name debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
    body('slug')
        .not()
        .isEmpty()
        .withMessage('El campo slug es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo slug debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
    body('summary')
        .not()
        .isEmpty()
        .withMessage('El campo summary es obligatorio')
        .isLength({ min: 1, max: 50 })
        .withMessage('El campo summary debe tener minimo 1 caracter y maximo 50 incluyendo espacios'),
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
module.exports = CompanyValidator;