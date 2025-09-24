import { check } from "express-validator";

export const postValidators = [
  check("title")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Title must be at least 10 characters long."),
  check("content")
    .trim()
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters long."),
];