import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";



export const isAuthenticated = async(req , res , next) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(400).json({
                success : false,
                message : "authorization token is mising or invalid"
            })
        }
        const token = authHeader.split(" ")[1]

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
            
        } catch (error) {
            if(error.name === "tokenExpiredError"){
                return res.status(400).json({
                    success : false,
                    message : "jwt token is expired"
                })
            }
        }

        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(400).json({
                success: false,
                message:"user not found"
            })
        }

        req.id = user._id
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : error.message
        })
    } 
}