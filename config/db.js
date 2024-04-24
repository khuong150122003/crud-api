const { default: mongoose } = require("mongoose");
require("dotenv").config();

// Connect to DB
const db = (process.env.MONGO_URL =
  "mongodb+srv://khuongtngcs210060:khuong1501@project1640.es8thni.mongodb.net/crud");

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("Database connected success");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
