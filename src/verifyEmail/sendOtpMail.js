import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpMail = (otp , email) =>{
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.MAIL_USER,
            pass : process.env.MAIL_PASS
        }
    })

    const mailconfiguration = {
        from : process.env.MAIL_USER,
        to : email,
        subject : " Password Reset OTP",
        html : `<p>youe one time password to forgot your password is  <b>${otp}</b></p>`

    }
    transporter.sendMail(mailconfiguration , function(error , info){
        if(error)throw Error(error)
            console.log("OTP send succesfully")
        console.log(info)
    })
}

