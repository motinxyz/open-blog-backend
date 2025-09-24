/**
 * Middleware to check if a user is authenticated.
 * It checks for the presence of `isLoggedIn` in the session.
 */
export const isAuthenticated = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401; // Unauthorized
    return next(error);
  }
  next();
};

export const isNotAuthenticated = (req, res, next) => {
  if (req.session.isLoggedIn) {
    const error = new Error("You're already authenticated, logout first");
    error.statusCode = 401;
    return next(error);
  }
  next();
};
