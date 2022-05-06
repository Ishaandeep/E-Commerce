const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter your Name"],
        maxlength:[30, "Name cannot be more than 30 character"],
        minLength:[4, "Name should have more than 4 character"],
    },
    email:{
        type:String,
        required:[true , "Enter your email"],
        unique:true,
        validate:[validator.isEmail, "Please Enter a valid email"],
    },
    password:{
        type:String,
        required:[true, "Please enter your password"],
        minLength:[8, "Password should be greater than 8 character"],
        select:false,
    },
    avatar:{
       public_id:{
           type:String,
           required:true
       },
       url:{
           type:String,
           required:true
       } 
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire: Date,
});
module.exports = mongoose.model("User", userSchema)