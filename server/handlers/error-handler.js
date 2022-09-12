const errorHandler = (error, req, res, next) => {
  //Check if response already sent
  if (res.headerSent) {
    return next(error);
  }

  // If error code is not given fall back to error code 500
  res.status(error.code || 500);

  // Respond with error message
  res.json({ message: error.message || "Unknown error" });
};

export default errorHandler;
