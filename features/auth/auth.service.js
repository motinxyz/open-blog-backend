import User from "./user.model.js";

export const handleUserLogin = async (email, password) => {
  // Find the user by email. We must explicitly ask for the password
  // field because we set `select: false` in the model.
  const user = await User.findOne({ email }).select("+password");

  // If no user is found, throw a specific error.
  // We use a generic message to avoid telling an attacker whether the email exists.
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // Return the user object without the password for security.
  user.password = undefined;
  return user;
};

export const handleUserRegistration = async (userData) => {
  const { firstName, lastName, email, password } = userData;

  // The validator already checks if the email is in use,
  // but this is a good final check in case the validator is ever bypassed.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("A user with this email already exists.");
    error.statusCode = 409; // 409 Conflict
    throw error;
  }

  const newUser = new User({ firstName, lastName, email, password });
  await newUser.save();

  return { success: true };
};
