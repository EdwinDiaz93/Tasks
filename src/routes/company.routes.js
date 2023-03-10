const companyRouter = require('express').Router();
const { body } = require('express-validator');
const Db = require('../models');

const { validatorRequest } = require('../middlewares');
const { CompanyController } = require('../controllers');
const { validateToken, validateRols } = require('../middlewares');


companyRouter.get('/',
    [validateToken, validateRols(['SuperAdmin'])],
    CompanyController.getCompanies);

companyRouter.get('/:slug',
    [validateToken, validateRols(['SuperAdmin'])],
    CompanyController.getCompany);

companyRouter.delete('/:slug',
    [validateToken, validateRols(['SuperAdmin'])],
    CompanyController.deleteCompany);

companyRouter.post('/',
    body('name')
        .not()
        .isEmpty()
        .withMessage('El campo name es obligatorio'),
    body('owner_name')
        .not()
        .isEmpty()
        .withMessage('El campo owner name es obligatorio'),
    body('slug')
        .custom(value => {
            if (!value) return Promise.reject('El campo slug es obligatorio');

            return Db.model('Company').findOne({ where: { slug: value } })
                .then(company => {
                    if (company) {
                        return Promise.reject(`Ya existe una compañia con slug ${value}`);
                    }
                }).catch(err => Promise.reject(err));
        }),
    body('summary')
        .not()
        .isEmpty()
        .withMessage('El campo summary es obligatorio'),
    [validateToken, validateRols(['SuperAdmin']), validatorRequest],
    CompanyController.saveCompany);


companyRouter.put('/:slug',
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
    CompanyController.updateCompany);


module.exports = companyRouter;


