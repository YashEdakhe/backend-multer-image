const mongoose = require("mongoose")
const Employee = require("../models/employee.model");

module.exports = {
    getAllEmployees: (req, res) => {
        Employee.find((err, results) => {
            if (!err) {
                res.send(results)
            } else {
                console.log(err)
            }
        })
    },

    getEmployeeByID: (req, res) => {
        Employee.findOne({
            id: req.params.id
        }, (err, foundEmployee) => {
            if (foundEmployee) {
                res.send(foundEmployee)
            } else {
                console.log(err)
                res.status(422).send({
                    errors: [{
                        title: `could not find data`
                    }]
                })
            }
        })
    },

    // getEmployeeImageById : (req,res)=>{

    // },

    deleteAllEmployees: (req, res) => {
        Employee.deleteMany((err) => {
            if (!err) {
                res.send("Employee Data Deleted Successfully")
            } else {
                res.status(404).send({
                    error: [{
                        title: "No data not found. Already deleted"
                    }]
                })
                console.log(err)
            }
        })
    },

    deleteEmployeeByID : (req, res) => {
        Employee.deleteOne({
            id: req.params.id
        }, (err) => {
            if (!err) {
                res.send("Employee Data Deleted Successfully")
            } else {
                res.status(404).send({
                    error: [{
                        title: "data not found. Already deleted"
                    }]
                })
            }
        })
    },

    createNewEmployee: (req, res) => {
        const newEmployee = new Employee({
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile: req.body.mobile,
            designation: req.body.designation,
            address: {
                street_number: req.body.street_number,
                street_name: req.body.street_name,
                city_name: req.body.city_name,
                country_name: req.body.country_name,
            },
            // img: {
            //     data: Buffer,
            //     contentType: String
            // }
        })
    
        newEmployee.save();
    }
}