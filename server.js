const express = require("express");

const app = express();
const PORT = 3000;

// ---------- Middleware ----------
app.use(express.json()); // parses JSON request bodies into req.body
app.use(express.urlencoded({ extended: true })); // parses form data

// Logs every request, e.g. "POST /api/students"
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// In-memory storage for student records
const students = [];

app.get("/", (req, res) => {
  res.send("Server is running");
});

// ---------- Task 2: Create a student record ----------
app.post("/api/students", (req, res) => {
  const body = req.body || {};
  const requiredFields = ["id", "name", "email", "course", "age"];

  // Find any mandatory fields that are missing or empty
  const missingFields = requiredFields.filter(
    (field) =>
      body[field] === undefined ||
      body[field] === null ||
      String(body[field]).trim() === ""
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Missing mandatory fields",
      missingFields: missingFields,
    });
  }

  const { id, name, email, course, age } = body;

  // Do not allow two students with the same id
  if (students.some((student) => student.id === id)) {
    return res.status(409).json({
      success: false,
      message: `Student with id ${id} already exists`,
    });
  }

  const newStudent = { id, name, email, course, age };
  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: newStudent,
  });
});

// ---------- 404 handler for unknown routes ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------- Error handler for invalid JSON ----------
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON format" });
  }
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});