# FSD Mid-Term 1

- **Name:** Deeptanshu Yadav
- **Section:** CSE-16
- **University Roll No:** 2500320100426


Backend server built with Node.js and Express.

## Run locally
npm install
npm start

Server runs on http://localhost:3000

## API
- POST /api/students - create a student (id, name, email, age are required)
- GET /api/students - get all students
- GET /api/students/:id - get one student by id
- PUT /api/students/:id - update a student's name, email or age
- DELETE /api/students/:id - delete a studentd

## Status Codes
- 200 OK - request succeeded
- 201 Created - student created
- 400 Bad Request - missing fields or invalid JSON
- 404 Not Found - student or route not found
- 409 Conflict - student id already exists
- 500 Internal Server Error - unexpected server error