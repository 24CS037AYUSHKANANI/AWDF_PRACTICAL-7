function errors(err, req, res, next) {
  console.error(`[24CS037] ${err.name}: ${err.message}`);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      studentId: "24CS037",
      message: "Validation failed",
      details: Object.values(err.errors).map(item => ({
        field: item.path,
        message: item.message
      }))
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      studentId: "24CS037",
      message: "Email is already registered"
    });
  }

  res.status(500).json({
    success: false,
    studentId: "24CS037",
    message: "Something went wrong on the server"
  });
}

module.exports = errors;
