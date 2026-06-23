import express from "express"
import { dbconnect } from "./src/config/db.js"
import dotenv from "dotenv"
import { router } from "./src/routes/userRoutes.js"

dotenv.config()
const app = express()

app.get("/",(req ,res ) =>{
    res.send("app runing successfully")
})

await dbconnect()

const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/api/v1/user",router)

app.listen(port , "0.0.0.0" , ()=>{
    console.log(`server runing on port No : ${port}`)
})