const Submission = require("../models/Submissions.js");
const Course = require("../models/Courses.js");
const Class = require("../models/Classes.js");
const User = require("../models/Admin.js");
const createSubmission = async (req, res) => {
  // Extract submission details from the request body
  const {
    student_id,
    class_name,
    class_code,
    course_name,
    assignment_id,
    submission_date,
    grade,
    comment,
  } = req.body;

  try {
    // Create the submission document
    const newSubmission = new Submission({
      student_id,
      class_name,
      class_code,
      course_name,
      assignment_id,
      submission_date,
      grade,
      comment,
    });

    // Save the submission document to the database
    await newSubmission.save();

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Submission created successfully",
      submission: newSubmission,
    });
  } catch (error) {
    // Send an error response if something goes wrong
    console.error("Failed to create submission:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create submission",
      error: error.message,
    });
  }
};

module.exports = { createSubmission };
