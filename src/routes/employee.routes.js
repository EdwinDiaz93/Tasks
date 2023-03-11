const companyRouter = require('express').Router();

const { validatorRequest } = require('../middlewares');
const { EmployeeValidator } = require('../validators');
const { EmployeeController } = require('../controllers');
const { validateToken, validateRols } = require('../middlewares');


companyRouter.get('/',
    [validateToken, validateRols(['Company'])],
    EmployeeController.getEmployees);

companyRouter.get('/:id',
    [validateToken, validateRols(['Company'])],
    EmployeeController.getEmployee);

companyRouter.delete('/:id',
    [validateToken, validateRols(['Company'])],
    EmployeeController.deleteEmployee);

companyRouter.post('/',
    ...EmployeeValidator
    ,
    [validateToken, validateRols(['Company']), validatorRequest],
    EmployeeController.saveEmployee);


companyRouter.put('/:id',
    ...EmployeeValidator,
    [validateToken, validateRols(['Company']), validatorRequest],
    EmployeeController.updateEmployee);


module.exports = companyRouter;


