const Submission = require("../models/Submissions.js");
const multer = require("multer");
const path = require("path");

const getSubmissions = async (req, res) => {
  try {
    // Find all submissions
    const submissions = await Submission.find();

    // Check if submissions were found
    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No submissions found",
      });
    }

    // Send the submissions in the response
    res.status(200).json({
      success: true,
      message: "Submissions retrieved successfully",
      submissions: submissions,
    });
  } catch (error) {
    // Handle errors
    console.error("Failed to get submissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get submissions",
      error: error.message,
    });
  }
};

const storage = multer.diskStorage({
  destination: "./public/uploads/", // Set the destination folder for uploaded files
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the filename
  },
});

const uploadSubmission = multer({
  storage: storage,
}).single("submissionFile");

const createSubmission = async (req, res) => {
  // Upload submission file
  uploadSubmission(req, res, async (err) => {
    if (err) {
      console.error("Error uploading submission file:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to upload submission file",
        error: err.message,
      });
    }

    // Extract submission details from the request body
    const {
      student_id,
      class_name,
      class_code,
      course_name,
      status,
      assignment_id,
      submission_date,
      title,
      description,
      grade,
      comment,
    } = req.body;

    // Get the file path of the uploaded submission file
    const submission_file = req.file ? req.file.path : null;

    try {
      // Create the submission document
      const newSubmission = new Submission({
        student_id,
        class_name,
        class_code,
        course_name,
        status,
        assignment_id,
        submission_date,
        title,
        description,
        grade,
        comment,
        submission_file, // Store the file path
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
  });
};

module.exports = { createSubmission, getSubmissions };
