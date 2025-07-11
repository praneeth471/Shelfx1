// middleware/notfoundMiddleware.js
export const notFound = (req, res, next) => {
    console.log(`Route not found: ${req.originalUrl}`); // Add logging
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.originalUrl}`
    });
    next();
  };