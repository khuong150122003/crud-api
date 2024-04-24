const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
  className: { type: String, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

module.exports = mongoose.model("Class", classSchema);
