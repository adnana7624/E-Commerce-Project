import express from "express"
export const router = express.Router()

import { login, register } from "../controller/userController.js";
import { reVerify, verifyUser } from "../controller/verifyemail.js";

router.post("/register",register)
router.get("/verify",verifyUser)
router.get("/reverify",reVerify)
router.post("/login",login)