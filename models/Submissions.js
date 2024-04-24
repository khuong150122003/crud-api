const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  student_id: { type: String, required: true },
  class_name: { type: String, required: true },
  class_code: { type: String, required: true },
  course_name: { type: String, required: true },
  assignment_id: { type: String, required: true },
  submission_date: { type: Date, required: true },
  grade: { type: String },
  comment: { type: String },
});

module.exports = mongoose.model("Submission", submissionSchema);