const companyRouter = require('express').Router();

const { validatorRequest } = require('../middlewares');
const { CompanyValidator } = require('../validators');
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
    ...CompanyValidator
    ,
    [validateToken, validateRols(['SuperAdmin']), validatorRequest],
    CompanyController.saveCompany);


companyRouter.put('/:slug',
    ...CompanyValidator,
    [validateToken, validateRols(['SuperAdmin']), validatorRequest],
    CompanyController.updateCompany);


module.exports = companyRouter;


