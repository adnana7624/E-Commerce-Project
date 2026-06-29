import express from "express"
export const router = express.Router()

import { forgotPassword, login, logout, register } from "../controller/userController.js";
import { reVerify, verifyUser } from "../controller/verifyemail.js";
import { isAuthenticated } from "../midleware/authMidleware.js";
import { sendOtpMail } from "../verifyEmail/sendOtpMail.js";

router.post("/register",register)
router.get("/verify",verifyUser)
router.get("/reverify",reVerify)
router.post("/login",login)
router.post("/logout", isAuthenticated , logout)
router.post("/forgotPassword",forgotPassword)