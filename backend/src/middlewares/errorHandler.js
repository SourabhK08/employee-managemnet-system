const errorHandler = (err, req, res, next) => {
  console.error("ERROR_HANDLER >>>", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    data: null,
  });
};

export { errorHandler };
