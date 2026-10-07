require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectMongo = require("./src/config/mongo");
const authRoutes = require("./src/routes/auth");
const taskRoutes = require("./src/routes/tasks");
const errorHandler = require("./src/middleware/errors");

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Create server/.env first.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `[24CS037] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`
  );
  next();
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    practical: "AWDF Practical 7",
    student: "Ayush Kanani",
    studentId: "24CS037",
    message: "Authentication API is running"
  });
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    studentId: "24CS037",
    message: "Endpoint not found"
  });
});

app.use(errorHandler);

async function start() {
  try {
    await connectMongo();

    app.listen(PORT, () => {
      console.log("----------------------------------------");
      console.log("AWDF Practical 7");
      console.log("Student: Ayush Kanani");
      console.log("ID: 24CS037");
      console.log("MongoDB: connected");
      console.log(`API: http://localhost:${PORT}`);
      console.log("----------------------------------------");
    });
  } catch (err) {
    console.error("Unable to start:", err.message);
    process.exit(1);
  }
}

start();
