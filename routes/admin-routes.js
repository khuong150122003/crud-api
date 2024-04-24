const express = require("express");
const router = express.Router();
const userC = require("../controllers/admin-controller.js");
const Class = require("../controllers/classes-controller.js");
const {
  registerValiations: registerValidations,
  loginValiations: loginValidations,
} = require("../controllers/admin-controller.js");
const Course = require("../controllers/courses-controller.js");
const Submission = require("../controllers/submissions-controller.js");

// Get list of all users
router.get("/", userC.getAllUser);

// User Sign Up
router.post("/signup", registerValidations, userC.signup);

// User Login
router.post("/login", loginValidations, userC.login);

// Update User Profile
router.patch("/:id", userC.updateUser);

// Delete User
router.delete("/:id", userC.deleteUser);

// Create Class
router.post("/classes", Class.createClass);

// Assign Student to Class
// router.post("/classes/assign", Class.assignStudentToClass);
router.post("/classes/:classId/students", Class.assignStudentToClass);

// Create Course
router.post("/courses", Course.createCourse);

//Submissions
router.post("/submissions", Submission.createSubmission);

module.exports = router;
