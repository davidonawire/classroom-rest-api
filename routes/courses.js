const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;

// Wrapper function to handle async functions in routes
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      res.status(500).send(error);
    }
  }
}

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: {
      model: User,
      as: 'Owner'
    }
  });
  res.json(courses);
}));

// GET /api/courses/:id 200 - Returns the course (including the user that owns the course) for the provided course ID

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content

// PUT /api/courses/:id 204 - Updates a course and returns no content

// DELETE /api/courses/:id 204 - Deletes a course and returns no content

module.exports = router;