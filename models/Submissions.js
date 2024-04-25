const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  student_id: { type: String, required: true },
  class_name: { type: String, required: true },
  class_code: { type: String, required: true },
  course_name: { type: String, required: true },
  status: { type: String },
  assignment_id: { type: String, required: true },
  submission_date: { type: Date, required: true },
  title: { type: String },
  description: { type: String },
  grade: { type: String },
  comment: { type: String },
  submission_file: { type: String }, // New field to store file path
});

module.exports = mongoose.model("Submission", submissionSchema);
