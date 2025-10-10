import { validationResult } from "express-validator";
import { handleUserLogin, handleUserRegistration } from "./auth.service.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages.js";

export const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      message: ERROR_MESSAGES.INVALID_INPUT,
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
    res.status(200).json({ message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL, user });
  } catch (error) {
    // Pass the error to the global error handler in app.js
    next(error);
  }
};

export const checkAuthStatus = (req, res, next) => {
  // console.log("recieved /api/auth/status req")
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
      message: ERROR_MESSAGES.INVALID_INPUT,
      errors: errors.array(),
    });
  }

  try {
    const newUser = await handleUserRegistration(req.body);
    res
      .status(201)
      .json({
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL,
        user: newUser,
      });
  } catch (error) {
    // Pass any errors to the global error handler in app.js
    next(error);
  }
};

export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      const error = new Error(ERROR_MESSAGES.LOGOUT_FAILED);
      error.statusCode = 500;
      return next(error);
    }
    // The destroy function is enough to remove the session.
    // The response should be sent from within its callback.
    res.clearCookie("connect.sid"); // The default cookie name from express-session
    return res.status(200).json({ message: SUCCESS_MESSAGES.LOGOUT_SUCCESSFUL });
  });
};
