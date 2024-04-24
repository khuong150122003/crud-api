const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/Admin.js");
const Class = require("../models/Classes.js");
const Course = require("../models/Courses.js");
const Submission = require("../models/Submissions.js");
const multer = require("multer");
const path = require("path");

const getAllUser = async (req, res, nxt) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err); // Corrected typo here
  }
  if (!users) {
    return res.status(404).json({ message: "No user found" });
  }
  return res.status(200).json({ users });
};

const registerValiations = [
  body("name").not().isEmpty().trim().withMessage("Name is required"),
  body("firstName").not().isEmpty().trim().withMessage("firstName is required"),
  body("lastName").not().isEmpty().trim().withMessage("lastName is required"),
  body("email").not().isEmpty().trim().withMessage("Email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters long"),
];

// router.post("/signup", userC.signup);
const signup = async (req, res, nxt) => {
  const { name, firstName, lastName, email, password, role } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }
  if (existingUser) {
    return res
      .status(422)
      .json({ errors: [{ msg: "Email is already taken" }] });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
  }
  const newUser = new User({
    name,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: err });
  }
  return res.status(201).json({
    _id: newUser.id,
    user: newUser,
    message: "User created successfully",
  });
};

const loginValiations = [
  body("email").not().isEmpty().trim().withMessage("Email is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

const login = async (req, res, nxt) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const matched = await bcrypt.compare(password, existingUser.password);
      if (matched) {
        return res.status(200).json({
          _id: existingUser.id,
          user: existingUser,
          message: "User logged in successfully",
        });
      } else {
        return res
          .status(401)
          .json({ errors: [{ msg: "Password is not correct" }] });
      }
    } else {
      // User not found
      return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: err });
  }
};

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./public/images/", // Set the destination folder for uploaded images
  filename: function (req, file, cb) {
    cb(null, "profile-" + Date.now() + path.extname(file.originalname)); // Set the filename
  },
  destination: "./public/uploads/", // Set the destination folder for uploaded files
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the filename
  },
});

// Init multer upload
const uploadProfileImage = multer({
  storage: storage,
}).single("profileImage");

const updateUser = async (req, res) => {
  // Upload image
  uploadProfileImage(req, res, async (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res
        .status(500)
        .json({ message: "Failed to upload image", error: err.message });
    }

    try {
      let updatedUserData = {
        name: req.body.name,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        // Update profile image path if image was uploaded
        profileImage: req.file ? req.file.filename : undefined, // Use only filename
      };

      // Check if password is provided
      if (req.body.password) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        updatedUserData.password = hashedPassword;
      }

      // Update the user
      const updatedUser = await User.updateOne(
        { _id: req.params.id },
        { $set: updatedUserData }
      );

      res.status(201).json({
        success: true,
        message: "User profile updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });
};

const deleteUser = async (req, res) => {
  try {
    const removedUser = await User.findByIdAndRemove(req.params.id);
    res.status(201).json({ removedUser, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const createClass = async (req, res) => {
  const { className, codeClass } = req.body;

  try {
    // Create a new class document
    const newClass = new Class({
      className,
      codeClass,
    });

    // Save the new class document to the database
    await newClass.save();

    // Send a success response
    return res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: newClass,
      codeClass: codeClass,
    });
  } catch (error) {
    // Send an error response if something goes wrong
    return res.status(500).json({
      success: false,
      message: "Failed to create class",
      error: error.message,
    });
  }
};

const assignStudentToClass = async (req, res) => {
  const { classId, studentId } = req.body;

  try {
    // Update the class document to add the student
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $push: { students: studentId } },
      { new: true }
    );

    // Optionally, update the student document to associate it with the class
    await User.findByIdAndUpdate(studentId, { class: classId });

    // Send a success response with the updated class information
    res.status(200).json({
      success: true,
      message: "Student assigned to class successfully",
      class: updatedClass,
    });
  } catch (err) {
    // Send an error response if any error occurs
    console.error("Error assigning student to class:", err);
    res.status(500).json({
      success: false,
      message: "Failed to assign student to class",
      error: err.message,
    });
  }
};

const createCourse = async (req, res) => {
  const { name, class_name, start_date, end_date } = req.body;

  try {
    const newCourse = new Course({
      name,
      email,
      class_name,
      start_date,
      end_date,
      documents: [],
      assignments: [],
    });

    // Save the course
    await newCourse.save();

    // Add the course to the class
    await Class.findByIdAndUpdate(class_name, {
      $push: { courses: newCourse._id },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: err.message,
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
      assignment_id,
      submission_date,
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
        assignment_id,
        submission_date,
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

module.exports = {
  getAllUser,
  signup,
  login,
  updateUser,
  deleteUser,
  createClass,
  assignStudentToClass,
  createCourse,
  uploadDocument,
  createAssignment,
  createSubmission,
  registerValiations,
  loginValiations,
};