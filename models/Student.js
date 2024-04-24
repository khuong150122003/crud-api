const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
});

module.exports = mongoose.model("Category", categorySchema);
