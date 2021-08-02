const mongoose = require("mongoose")
const Schema = mongoose.Schema;

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


const employeeSchema = new Schema({
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
    img:{
        name:String,
        data:Buffer,
        contentType:String
    }
})

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;