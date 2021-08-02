// node Modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();

//Man-Made Modules 
const EmployeeRoute = require(`./Routes/employee.routes`)
const EmployeeModel = require(`./models/employee.model`)
const EmployeeController = require("./controller/employees.controller")


app.use(bodyParser.urlencoded({extended:true}));
app.use('/employee',EmployeeRoute);

app.listen(3000,(req,res)=>{
    console.log(`App Connection Successful at 3000`)
})