const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  courses: [{ type: Schema.Types.ObjectId, ref: "Courses" }],
  // student_id: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  // coordinator_id: [{ type: Schema.Types.ObjectId, ref: "Coordinator" }],
});

module.exports = mongoose.model("Class", classSchema);
