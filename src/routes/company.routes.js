const companyRouter = require('express').Router();

const { validatorRequest } = require('../middlewares');
const { CompanyValidator } = require('../validators');
const { CompanyController } = require('../controllers');
const { validateToken, validateRols } = require('../middlewares');


companyRouter.get('/',
    [validateToken, validateRols(['SuperAdmin'])],
    CompanyController.getCompanies);

companyRouter.get('/:id',
    [validateToken, validateRols(['SuperAdmin'])],
    CompanyController.getCompany);

companyRouter.delete('/:id',
    [validateToken, validateRols(['SuperAdmin'])],
    CompanyController.deleteCompany);

companyRouter.post('/',
    ...CompanyValidator
    ,
    [validateToken, validateRols(['SuperAdmin']), validatorRequest],
    CompanyController.saveCompany);


companyRouter.put('/:id',
    ...CompanyValidator,
    [validateToken, validateRols(['SuperAdmin']), validatorRequest],
    CompanyController.updateCompany);


module.exports = companyRouter;


