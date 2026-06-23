import mongoose  from "mongoose";
import dotenv from "dotenv"

const dbconnect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb connect successfully")
    } catch (error) {
        console.log("Database conection error")
    }
}

export {dbconnect}