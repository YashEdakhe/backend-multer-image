const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage')
// const Grid = require('gridfs-stream')

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

//////////////////////////////////////////////////////////// Database Connection  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
mongoose.connect("mongodb://localhost:27017/employeeDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, result) => {
    if (result) {
        console.log("DB connection Successful at 27017")
    } else {
        console.log("Database error")
    }
});

const employeeSchema = mongoose.Schema({
    id: Number,
    firstName: String,
    lastName: String,
    email: String,
    mobile: Number,
    designation: String,
    address: {
        street_number: Number,
        street_name: String,
        city_name: String,
        country_name: String,
    },
})

const imageSchema = mongoose.Schema({
    id : Number,
    img: {
        data: Buffer,
        contentType: String
    }
})

const Employee = mongoose.model("Employee", employeeSchema);
const Image = mongoose.model("Image",imageSchema);
//////////////////////////////////////////////////////////// Getting All Data  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.route('/employee')
    .get((req, res) => {
        Employee.find((err, result) => {
            if (result) {
                res.send(result)
            } else {
                console.log(err);
            }
        });
    })
    .delete((req, res) => {
        Employee.deleteMany((err) => {
            if (!err) {
                res.send("All Articles are Deleted Succfully")
            } else {
                console.log(err)
            }
        })
    })
    .post((req, res) => {
        const newEmployee = new Employee({
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            designation: req.body.designation,
            email: req.body.email,
            mobile: req.body.mobile,
            // img:{
            //      data: req.body.Buffer,
            //      contentType: req.body.contentType  
            // },
        });

        newEmployee.save();
    })

//////////////////////////////////////////////////////////// Getting Specific Data  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.route('/employee/:id')
    .get((req, res) => {
        Employee.findOne({
            id: req.params.id
        }, (err, foundEmployee) => {
            if (foundEmployee) {
                res.send(foundEmployee)
            } else {
                console.log(err)
            }
        });
    })

    .delete((req, res) => {
        Employee.deleteOne({
            id: req.params.id
        }, (err) => {
            if (!err) {
                res.send("Employee Data Deleted Successfully!")
            } else {
                console.log(err)
            }
        })
    })

app.route('/image/:id')
.get((req, res) => {
    Image.findOne({
        id: req.params.id
    }, (err, foundImage) => {
        if (foundImage) {
            console.log(foundImage)
            res.send(foundImage)
        } else {
            console.log(err)
        }
    });
})  
//////////////////////////////////////////////////////////// Image Upload  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.post('/imageUpload', upload.single('myImage'), (req, res) => {
    const newImage = new Image({
        id : req.body.id,
    });
    newImage.img.data = fs.readFileSync(req.file.path)
    newImage.img.contentType = `image/png`;
    newImage.save();
});

//////////////////////////////////////////////////////////// Connection Check  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.listen(3000, function (req, res) {
    console.log(`Server Connection Successful on port 3000`);
})










