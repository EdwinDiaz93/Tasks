const mainRouter = require('express').Router();

const authRouter = require('./auth.routes');
const usuarioRouter = require('./usuario.routes');


mainRouter.use('/auth', authRouter);
mainRouter.use('/usuarios', usuarioRouter);


module.exports = mainRouter;
