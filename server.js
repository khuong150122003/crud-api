const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const userR = require("./routes/admin-routes");
const productR = require("./routes/coordinator-router");
const studentR = require("./routes/student-router");
const orderR = require("./routes/manager-routes");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Working" });
});

app.use("/api/admin", userR);
app.use("/api/admin/classes", orderR);
app.use("/api/coordinator", productR);
app.use("/api/student", studentR);

// Connect DataBase
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${port}`);
});
