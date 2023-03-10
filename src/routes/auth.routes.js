const authRouter = require('express').Router();
const { body } = require('express-validator')
const { AuthController } = require('../controllers');
const { validateToken, validatorRequest, validateRols } = require('../middlewares');


// Login de usuario
authRouter.post('/login',
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
    [validatorRequest],
    AuthController.login);
authRouter.get('/refresh-token', [validatorRequest, validateToken], AuthController.refresh);

module.exports = authRouter;
