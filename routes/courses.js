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
router.get('/:id', asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    include: {
      model: User,
      as: 'Owner'
    }
  });

  if (course) {
    res.json(course);
  } else {
    const error = new Error("Record not found");
    error.status = 500;
    next(error);
  }
}));

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/', asyncHandler(async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).location('/api/courses/' + course.id).end();
  } catch (error) {
    // Handle errors
  }
  
}));

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/:id', asyncHandler(async (req, res, next) => {
  let course;
  try {
    course = await Course.findByPk(req.params.id);
    if (course) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      const error = new Error("Record not found");
      error.status = 500;
      next(error);
    }
  } catch (error) {
    // Handle errors
  }
}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content

module.exports = router;