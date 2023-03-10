const usuarioRouter = require('express').Router();
const { body } = require('express-validator');

const { validatorRequest } = require('../middlewares');
const { UsuarioController } = require('../controllers');
const { validateToken, validateRols } = require('../middlewares');


usuarioRouter.get('/',
    [validateToken, validateRols(['SuperAdmin'])],
    UsuarioController.getUsuarios);

usuarioRouter.get('/:id',
    [validateToken, validateRols(['SuperAdmin'])],
    UsuarioController.getUsuario);

usuarioRouter.delete('/:id',
    [validateToken, validateRols(['SuperAdmin'])],
    UsuarioController.deleteUsuario);

usuarioRouter.post('/',    
    body('email')
        .not()
        .isEmpty()
        .withMessage('El campo email es obligatorio')
        .isEmail()
        .withMessage('El campo email debe ser valido'),
    body('password')
        .not()
        .isEmpty()
        .withMessage('El campo password es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El campo password debe tener almenos 3 caracteres'),
    [validateToken, validateRols(['SuperAdmin']), validatorRequest],
    UsuarioController.saveUsuario);


usuarioRouter.put('/:id',    
    body('email')
        .not()
        .isEmpty()
        .withMessage('El campo email es obligatorio')
        .isEmail()
        .withMessage('El campo email debe ser valido'),
    body('password')
        .not()
        .isEmpty()
        .withMessage('El campo password es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El campo password debe tener almenos 3 caracteres'),
    [validateToken, validateRols(['SuperAdmin']), validatorRequest],
    UsuarioController.updateUsuario);


module.exports = usuarioRouter;


