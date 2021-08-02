const express = require('express');
const router = express.Router();

const EmployeeController = require("../controller/employees.controller")


// Get List of All Employees
router.get('/', EmployeeController.getAllEmployees)
//Get  Employee by ID
router.get('/:id', EmployeeController.getEmployeeByID)

// Delete All Employees
router.delete('/', EmployeeController.deleteAllEmployees)
//Delete Employees By Id
router.delete('/:id', EmployeeController.deleteEmployeeByID)
// Create new Employee
router.post('/', EmployeeController.createNewEmployee);

//Get  Employee Image by ID
// router.get('/:id', EmployeeController.getEmployeeImageByID)

module.exports = router;