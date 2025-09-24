import { check } from "express-validator";
import User from "./user.model.js";

export const validateLoginForm = [
  check("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Email Address")
    .normalizeEmail(),
  check("password").notEmpty().withMessage("Password cannot be empty"),
];

export const validateRegistrationForm = [
  check("firstName")
    .trim()
    .notEmpty()
    .withMessage("First Name is required")
    .isAlpha()
    .withMessage("Name can only contain letters"),
  check("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last Name is required")
    .isAlpha()
    .withMessage("Name can only contain letters"),
  check("email")
    .trim()
    .isEmail()
    .withMessage("Valid Email Address Required")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        return Promise.reject("User already exists");
      }
    })
    .normalizeEmail(),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  check("termsAccepted").custom((termsAccepted) => {
    if (
      !termsAccepted ||
      termsAccepted === "false" ||
      termsAccepted === false
    ) {
      throw new Error("You must accept the terms & Conditions");
    }
    return true;
  }),
];
