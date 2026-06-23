import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const verifyEmail = (token , email) =>{
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
        subject : "Email Verificaiton ",
        text : `hi you recently visit our website therfore please click on link to verify your email for registration http://10.173.233.148:8000/verify/${token} Thanks`

    }
    transporter.sendMail(mailconfiguration , function(error , info){
        if(error)throw Error(error)
            console.log("Email send succesfully")
        console.log(info)
    })                                                                                                
}

