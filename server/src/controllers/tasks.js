const mongoose = require("mongoose");
const Task = require("../models/Task");

async function all(req, res, next) {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      studentId: "24CS037",
      tasks
    });
  } catch (err) {
    next(err);
  }
}

async function add(req, res, next) {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || "",
      priority: req.body.priority || "medium",
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      studentId: "24CS037",
      message: "Task created",
      task
    });
  } catch (err) {
    next(err);
  }
}

async function change(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        studentId: "24CS037",
        message: "Task not found"
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        studentId: "24CS037",
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      studentId: "24CS037",
      message: "Task updated",
      task
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        studentId: "24CS037",
        message: "Task not found"
      });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        studentId: "24CS037",
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      studentId: "24CS037",
      message: "Task deleted"
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { all, add, change, remove };
