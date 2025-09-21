import { validationResult } from "express-validator";
import { handleUserLogin, handleUserRegistration } from "./auth.service.js";

export const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      message: "Invalid data",
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;
    const user = await handleUserLogin(email, password);

    // On successful login, attach user info to the session
    req.session.isLoggedIn = true;
    req.session.user = user;
    // req.session.isAuthenticated = true;
    // Respond with success message and user data
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    // Pass the error to the global error handler in app.js
    next(error);
  }
};

export const checkAuthStatus = (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(200).json({ isAuthenticated: false, user: null });
  }
};

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      message: "Invalid Inputs",
      errors: errors.array(),
    });
  }

  try {
    const newUser = await handleUserRegistration(req.body);
    res
      .status(201)
      .json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    // Pass any errors to the global error handler in app.js
    next(error);
  }
};

export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      const error = new Error("Failed to log out.");
      error.statusCode = 500;
      return next(error);
    }
    // By default, connect-mongodb-session doesn't remove the cookie.
    res.clearCookie("connect.sid"); // The default cookie name from express-session
    return res.status(200).json({ message: "Logout successful." });
  });
};
