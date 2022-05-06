const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
userSchema.pre("save",async function(next){
    
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password , 10);
});

// jwt token
userSchema.methods.getJWTTOKEN = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
};

// compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


module.exports = mongoose.model("User", userSchema)