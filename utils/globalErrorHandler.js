export default (error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "An unexpected error occurred.";

  // In development, send more details. In production, keep it simple.
  if (process.env.NODE_ENV === "production") {
    console.error("Error:", { status, message });
    res.status(status).json({ message: "An error occurred." });
  } else {
    console.error("Error:", { status, message, stack: error.stack });
    res.status(status).json({ message, stack: error.stack });
  }
};
