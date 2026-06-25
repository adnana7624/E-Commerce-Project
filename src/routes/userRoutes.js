import express from "express"
export const router = express.Router()

import { login, logout, register } from "../controller/userController.js";
import { reVerify, verifyUser } from "../controller/verifyemail.js";
import { isAuthenticated } from "../midleware/authMidleware.js";

router.post("/register",register)
router.get("/verify",verifyUser)
router.get("/reverify",reVerify)
router.post("/login",login)
router.post("/logout", isAuthenticated , logout)
