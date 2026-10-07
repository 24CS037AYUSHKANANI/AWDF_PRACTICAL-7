const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(id) {
  return jwt.sign(
    { id: id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function register(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    if (!email || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        studentId: "24CS037",
        message: "Valid email and password of at least 6 characters are required"
      });
    }

    const alreadyExists = await User.findOne({ email });

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        studentId: "24CS037",
        message: "Email is already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: passwordHash
    });

    res.status(201).json({
      success: true,
      studentId: "24CS037",
      message: "Account created successfully",
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user || typeof password !== "string") {
      return res.status(401).json({
        success: false,
        studentId: "24CS037",
        message: "Invalid email or password"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        studentId: "24CS037",
        message: "Invalid email or password"
      });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      studentId: "24CS037",
      message: "Login successful",
      token,
      expiresIn: "1h"
    });
  } catch (err) {
    next(err);
  }
}

async function profile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("_id email createdAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        studentId: "24CS037",
        message: "User not found"
      });
    }

    res.json({
      success: true,
      studentId: "24CS037",
      user
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, profile };
