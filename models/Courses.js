const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: { type: String, required: true },
  class_name: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  assignments: [{ type: Schema.Types.ObjectId, ref: "Assignment" }],
});

module.exports = mongoose.model("Course", courseSchema);
