const mongoose = require("mongoose");

async function connectMongo() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is missing from server/.env");
  }

  await mongoose.connect(uri);
}

module.exports = connectMongo;
