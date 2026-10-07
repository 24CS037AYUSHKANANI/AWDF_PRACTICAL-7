function validateTask(req, res, next) {
  const { title, priority } = req.body;

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      studentId: "24CS037",
      message: "Task title is required"
    });
  }

  if (
    priority !== undefined &&
    !["low", "medium", "high"].includes(priority)
  ) {
    return res.status(400).json({
      success: false,
      studentId: "24CS037",
      message: "Priority must be low, medium, or high"
    });
  }

  next();
}

module.exports = validateTask;
