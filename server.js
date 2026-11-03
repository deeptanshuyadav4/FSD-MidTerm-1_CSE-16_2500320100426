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

// Helper: find a student's position in the array by id.
// The id from the URL is a string ("101") and the stored id is a number (101),
// so both are converted to strings before comparing.
function findStudentIndex(id) {
  return students.findIndex((student) => String(student.id) === String(id));
}

app.get("/", (req, res) => {
  res.send("Server is running");
});

// ---------- Task 2: Create a student record ----------
app.post("/api/students", (req, res) => {
  const body = req.body || {};
  const requiredFields = ["id", "name", "email", "age"];

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

  const { id, name, email, age } = body;

  // Do not allow two students with the same id
  if (findStudentIndex(id) !== -1) {
    return res.status(409).json({
      success: false,
      message: `Student with id ${id} already exists`,
    });
  }

  const newStudent = { id, name, email, age };
  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: newStudent,
  });
});

// ---------- Task 3: Get all students ----------
app.get("/api/students", (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// ---------- Task 3: Get a student by id ----------
app.get("/api/students/:id", (req, res) => {
  const index = findStudentIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with id ${req.params.id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: students[index],
  });
});

// ---------- Task 4: Update a student by id ----------
app.put("/api/students/:id", (req, res) => {
  const index = findStudentIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with id ${req.params.id} not found`,
    });
  }

  const body = req.body || {};
  const updatableFields = ["name", "email", "age"];

  // Only fields that were actually sent will be updated
  const fieldsToUpdate = updatableFields.filter(
    (field) =>
      body[field] !== undefined &&
      body[field] !== null &&
      String(body[field]).trim() !== ""
  );

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update: name, email or age",
    });
  }

  // The id comes from the URL and is never changed
  fieldsToUpdate.forEach((field) => {
    students[index][field] = body[field];
  });

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: students[index],
  });
});

// ---------- Task 5: Delete a student by id ----------
app.delete("/api/students/:id", (req, res) => {
  const index = findStudentIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with id ${req.params.id} not found`,
    });
  }

  // splice removes the student from the array and returns it
  const deletedStudent = students.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
    data: deletedStudent,
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