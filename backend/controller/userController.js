const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require('../utils/sendEmail')

// Register a User
exports.registerUser = catchAsyncErrors(async(req, res , next)=>{
    const {name,email,password} = req.body
    const user = await User.create({
        name , email,password ,
        avatar:{
            public_id:"This is a temporary id",
            url:"ProfilpicUrl"
        }
    });
    sendToken(user,201,res);

   
});

// Login User
exports.loginUser = catchAsyncErrors( async(req,res,next)=>{
    const{email,password} = req.body;
    //checking if user has given password aand email both
    if(!email|| !password){
        return next(new ErrorHandler("Please Enter  email & password" , 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    sendToken(user,200,res);
    
});

// Logout User
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie('token', "",{
        Expires:new Date(Date.now()),
        HttpOnly:true,
    });


    res.status(200).json({
        success:true,
        message:"Logged Out",
    });
});

// Forget Password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found" , 404));
    }
    // Get Reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({  validateBeforeSave:false });
    const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;
  const message = `your password resent token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested reset then , pleae ignore it `
  try{
      await sendEmail({
          email:user.email,
          subject: `Ecommerce Password Recovery`,
          message,

      });
      res.status(200).json({
          success:true,
          message:`Email sent to ${user.email} successfully`,
      })

  }catch(error){
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({  validateBeforeSave:false });
      return next(new ErrorHandler(error.message ,500));
  }
});