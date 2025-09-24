import express from "express";
import {
  login,
  checkAuthStatus,
  registerUser,
  logout,
} from "./auth.controller.js";
import {
  validateLoginForm,
  validateRegistrationForm,
} from "./auth.validator.js";
import {
  isAuthenticated,
  isNotAuthenticated,
} from "../../services/isAuthenticated.middleware.js";

const authRouter = express.Router();

authRouter.post("/login", isNotAuthenticated, validateLoginForm, login);
authRouter.get("/status", checkAuthStatus);
authRouter.post(
  "/register",
  validateRegistrationForm,
  isNotAuthenticated,
  registerUser
);
authRouter.post("/logout", isAuthenticated, logout);

export default authRouter;
