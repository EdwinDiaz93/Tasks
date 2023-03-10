const mainRouter = require('express').Router();

const authRouter = require('./auth.routes');
const usuarioRouter = require('./usuario.routes');
const companyRouter = require('./company.routes');


mainRouter.use('/auth', authRouter);
mainRouter.use('/usuarios', usuarioRouter);
mainRouter.use('/companies', companyRouter);


module.exports = mainRouter;
