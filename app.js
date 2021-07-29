const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage')
// const Grid = require('gridfs-stream')
const { urlencoded } = require('body-parser');



const app = express();
app.use(bodyParser.urlencoded({extended:true}));

var storage = multer.diskStorage({
    destination:  (req, file, cb) =>{
      cb(null, 'uploads')
    },
    filename: (req, file, cb) =>{
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })

const upload = multer({
    storage:storage
})

//////////////////////////////////////////////////////////// Database Connection  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
mongoose.connect("mongodb://localhost:27017/employeeDB",{ useNewUrlParser: true ,useUnifiedTopology: true},(err,result)=>{
    if(result){
        console.log("DB connection Successful at 27017")
    }else{
        console.log("Database error")
    }
});

const employeeSchema = mongoose.Schema({
    id : Number,
    firstName: String,
    lastName : String,
    email : String,
    mobile : Number,
    designation : String,
    address : {
        street_number:Number, 
        street_name:String,
        city_name:String,
        country_name:String,
    },
    img: {
        data: Buffer,
        contentType: String
    }
})

const Employee = mongoose.model("Employee",employeeSchema);

//////////////////////////////////////////////////////////// Getting All Data  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.route('/employee')
    .get((req,res)=>{
        Employee.find((err,result)=>{
            if(result){
                res.send(result)
            }else{
                console.log(err);
            }
        });
    })
    .delete((req,res)=>{
        Employee.deleteMany((err)=>{
            if(!err){
                res.send("All Articles are Deleted Succfully")
            }else{
                console.log(err)
            }
        })
    })
    // .post((req,res)=>{
    //     const newEmployee = new Employee({
    //         id : req.body.id,
    //         firstName : req.body.firstName,
    //         lastName : req.body.lastName,
    //         designation: req.body.designation,
    //         email : req.body.email,
    //         mobile: req.body.mobile,
    //         address:{
    //             street_number: req.body.address.street_number,
    //             street_name  : req.body.address.street_name,
    //             city_name    : req.body.address.city_name,
    //             country_name : req.body.address.country_name,
    //         },
    //         img:{
    //              data: req.body.img.Buffer,
    //              contentType: req.body.img.contentType  
    //         },
    //     });
        
    //     newEmployee.save();
    // })

//////////////////////////////////////////////////////////// Getting Specific Data  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.route('/employee/:id')
    .get((req,res)=>{
        Employee.findOne({id:req.params.id},(err,foundEmployee)=>{
            if(foundEmployee){
                res.send(foundEmployee)
            }else{
                console.log(err)
            }
        });
    })

    .delete((req,res)=>{
        Employee.deleteOne({id:req.params.id},(err)=>{
            if(!err){
                res.send("Employee Data Deleted Successfully!")
            }else{
                console.log(err)
            }
        })
    })
//////////////////////////////////////////////////////////// Image Upload  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.post('/upload',upload.single('myImage'),(req,res)=>{
    const newItem = new Employee();
    newItem.img.data = fs.readFileSync(req.file.path)
    newItem.img.contentType =  `image/png`;
    newItem.save();
   });

//////////////////////////////////////////////////////////// Connection Check  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.listen(3000,function (req,res){
    console.log(`Server Connection Successful on port 3000`);
})