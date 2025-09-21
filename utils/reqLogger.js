export const logIncomingRequest = (req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
};
