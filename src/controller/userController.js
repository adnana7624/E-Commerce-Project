import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../verifyEmail/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOtpMail } from "../verifyEmail/sendOtpMail.js";


export const register = async(req , res)=>{
    try {

        const {firstName,lastName,password,email} = req.body;

        if(!firstName || !lastName || !email || !email){
            return res.status(400).json({
                success : false,
                message:"all field are required"
            })
        }
        
        const user= await User.findOne({email})
        if(user){
            return res.status(400).json({
                success:false,
                message:"user already exist"
            })
        }

        const hashedPass = await bcrypt.hash(password,10)

        const newuser = await User.create({
            firstName,
            lastName,
            email,
            password : hashedPass
        })

        const token = await jwt.sign({
            id : newuser._id},
            process.env.JWT_SECRET,
            {expiresIn:"10d"}
        )
        await verifyEmail(token,email) // send email here
        
        newuser.token = token
        await newuser.save();

        return res.status(201).json({
            success:true,
            message:"user register succesfully",
            new:newuser
        })

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

export const login = async(req, res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"all field are required"
            })
        }
        const existingUser = await User.findOne({email})

        if(!existingUser){
            return res.status(400).json({
                success: false,
                message:"user not ecist"
            })
        }

        const isPasswordValid = await bcrypt.compare(password,existingUser.password)

        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: " invalid crendintial"
            })
        }
        if(existingUser.isverified === false){
            return res.status(400).json({
                success:false,
                message:"verify your acount then login"
            })
        }

        // Generate access and refresh token
        const accessToken = jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{expiresIn : '10d'})
        const refreshToken = jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{expiresIn : '20d'})

        existingUser.isLogedIn = true
        await existingUser.save();

        // check for existing sesion if avialbe delte it
        const exsistingSession = await Session.findOne({userId : existingUser._id})
        
        if(exsistingSession){
            await Session.deleteOne({userId:existingUser._id})
        }

        // create new session
        await Session.create({userId:existingUser._id})
        return res.status(200).json({
            success : true,
            message : `Welcome Back ${existingUser.firstName}`,
            user : existingUser,
            accessToken,
            refreshToken
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message : error.message
        })
    }
}

export const logout = async(req, res) =>{
    try {
        const userId = req.id
        await Session.deleteMany({userId:userId})
        await User.findByIdAndUpdate(userId, {isLogedIn : false})

        return res.status(200).json({
            success: true,
            message : "user LogOut successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : error.message
        })
    }
}

export const forgotPassword = async(req , res ) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success: false,
                message:" user not found"
            })
        }

        const otp = Math.floor(100000+Math.random()*900000).toString()
        const otpExpiry = new Date(Date.now()+10*60*1000)

        user.otp = otp
        user.otpExpiry = otpExpiry

        await user.save()
        await sendOtpMail(otp , email)

        return res.status(200).json({
            success : true,
            message : "otp send successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success : false,
            message: error.message
        })
    }
}

export const veriftyOtp = async (req , res) =>{
    try {
        const {otp } = req.body
        const email = req.params.email

        if(!otp){
            return res.status(400).json({
                success : false,
                message : "otp is required"
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success : false,
                message : "user not found"
            })
        }
        if(!user.otp || !user.otpExpiry){
            return res.status(400).json({
                success : false ,
                message : "otp is alredya verify or expidre"
            })
        }
        if(user.otpExpiry < new Date()){
            return res.status(400).json({
                success :false ,
                message : "otp expired please request a new ine to send"
            })
        }
        if(otp !== user.otp ){
            return res.status(400).json({
                success : false,
                message : "otp is invalid"
            })
        }
        user.otp = null
        user.otpExpiry = null
        await user.save()

        return res.status(200).json({
            success : true,
            message : "orp verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success : false, 
            message : error.message
        })
    }
}

// const changePassword = async(req,res )=>{
//     try {
//         const {newPassword , confirmPassword} = req.body
//         const {email} = req.params.email

        
//     } catch (error) {
//         return res.status(500).json({
//             success : false,
//             message : error.message
//         })
//     }
// }