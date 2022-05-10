const nodeMailer = require('nodemailer');
const sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        server:'gmail',
        auth:{
            user:"",
            password:""
        }
    })
    const mailOptions ={
        from:"",
        to:"",
        subject:"",
        text:""
    }
};
module.exports = sendEmail;