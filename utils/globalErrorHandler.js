import { ERROR_MESSAGES } from "../constants/messages.js";

export default (error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;

  if (process.env.NODE_ENV === "production") {
    // console.error("Error:", { status, message });
    res.status(status).json({ message });
  } else {
    console.error("Error:", { status, message, stack: error.stack });
    res.status(status).json({ message, stack: error.stack });
  }
};
