const Class = require("../models/Classes");
const User = require("../models/Admin.js");

const getAllClasses = async (req, res) => {
  try {
    // Retrieve all classes from the database
    const classes = await Class.find();

    // Send a success response with the classes
    res.status(200).json({
      success: true,
      message: "Classes retrieved successfully",
      classes: classes,
    });
  } catch (err) {
    // Send an error response if something goes wrong
    console.error("Failed to retrieve classes:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve classes",
      error: err.message,
    });
  }
};

const createClass = async (req, res) => {
  const { name, code, student_id, coordinator_id } = req.body;

  try {
    // Create a new class document
    const newClass = new Class({
      name,
      code,
      // student_id,
      // coordinator_id,
    });

    // Save the new class document to the database
    await newClass.save();

    // Send a success response
    return res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: newClass,
      code: code,
    });
  } catch (err) {
    console.error("Error creating class:", err);
    res.status(500).json({ message: err });
  }
};

// Assign Student to Class
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

module.exports = {
  createClass,
  getAllClasses,
  assignStudentToClass,
};
