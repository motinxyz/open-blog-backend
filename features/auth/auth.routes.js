import express from "express";
import { login, checkAuthStatus, registerUser, logout } from "./auth.controller.js";
import { validateLoginForm, validateRegistrationForm } from "./auth.validator.js";

const authRouter = express.Router();

authRouter.post("/login", validateLoginForm, login);
authRouter.get("/status", checkAuthStatus);
authRouter.post("/register", validateRegistrationForm ,registerUser);
authRouter.post("/logout", logout)

export default authRouter;
