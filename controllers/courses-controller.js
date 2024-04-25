const Course = require("../models/Courses.js");
const Class = require("../models/Classes.js");
const User = require("../models/Admin.js");

const getAllCourses = async (req, res) => {
  try {
    // Retrieve all courses from the database
    const courses = await Course.find()
      .populate("documents")
      .populate("assignments");

    // Format the courses data to include documents and assignments as specified
    const formattedCourses = courses.map((course) => ({
      name: course.name,
      class_name: course.class_name,
      start_date: course.start_date.toISOString().split("T")[0],
      end_date: course.end_date.toISOString().split("T")[0],
      documents: course.documents.map((document) => ({
        filename: document.filename,
        documenturl: document.documenturl,
        uploadDate: document.uploadDate.toISOString().split("T")[0],
      })),
      assignments: course.assignments.map((assignment) => ({
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.due_date.toISOString().split("T")[0],
      })),
    }));

    // Send a success response with the formatted courses
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      courses: formattedCourses,
    });
  } catch (err) {
    // Send an error response if something goes wrong
    console.error("Failed to retrieve courses:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: err.message,
    });
  }
};

// Create Course
const createCourse = async (req, res) => {
  // Extract course details, documents, and assignments from the request body
  const {
    name,
    class_name,
    class_code,
    start_date,
    end_date,
    documents,
    assignments,
  } = req.body;

  try {
    // Create the course document
    const newCourse = new Course({
      name,
      class_name,
      class_code,
      start_date,
      end_date,
      documents: [], // Initialize with empty arrays for documents and assignments
      assignments: [],
    });

    // Save the course document to the database
    await newCourse.save();

    // Enroll students in the course (pseudo code)
    // Fetch students from the class associated with the course
    // Add students to the students array of the course

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    // Send an error response if something goes wrong
    console.error("Failed to create course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Upload Document to Course
const uploadDocument = async (req, res) => {
  // Implementation to upload document to course
};

// Create Assignment in Course
const createAssignment = async (req, res) => {
  // Implementation to create assignment in course
};

module.exports = {
  createCourse,
  uploadDocument,
  createAssignment,
  getAllCourses,
};
