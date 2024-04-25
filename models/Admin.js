const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: {
    type: String,
    default: "admin",
    enum: ["admin", "student", "coordinator", "manager", "guest"], // Added enum for role types
  },
  password: { type: String, required: true },
  address: { type: String, required: false },
  phone: { type: String, required: false },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  profileImage: { type: String }, // New field to store the path of the profile image
});

module.exports = mongoose.model("Admin", userSchema);
