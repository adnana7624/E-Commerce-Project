// import jwt from "jsonwebtoken";
// import {User} from "../models/userModel.js";

// export const verifyUser = async(req , res ) =>{
//     try {
//         const {token} = req.;
//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );

//         const user = await User.findById(decoded.id);
//         if(user){
//             return res.status(404).json("user not found")
//         }

//         user.isVerified = true;
//         await user.save();
//         res.send("Email verifed successfully");

//     } catch (error) {
//         return res.status(500).json(
//             {message : error.message}
//         )
//     }
// }



import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { verifyEmail } from "../verifyEmail/verifyEmail.js";

export const verifyUser = async(req , res ) =>{
    try {
        const authHeader = req.headers.authorization
        if(!authHeader ){
            return res.status(400).json({
                success:false,
                Message:"authorizaiton token missing or invalid"
            })
        }
        const token = authHeader.split(" ")[1]
        let decoded
        try {
            decoded = jwt.verify(token,process.env.JWT_SECRET)
        } catch (error) {
            if(error.name === "tokenExpiredError"){
                return res.status(400).json({
                    success:false,
                    message:"token Expired"
                })
            }
        }
        const user = await User.findById(decoded.id)
        if(!user){
            console.log("user not found")
        }
        user.token = null
        user.isverified = true
        await user.save()

        return res.status(200).json({
            success:true,
            message:"email verified successfully"
        })
        to
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

export const reVerify = async(req , res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message : " User not found"
            })
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn : '10d'}
        )
        verifyEmail(token,email)
        user.token = token
        await user.save()

        return res.status(200).json({
            success:true,
            message:"verfication email send again successfully",
            token : user.token
        })

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}