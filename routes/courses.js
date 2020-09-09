const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

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

// Authentication code adapted from Treehouse REST API Auth with Express workshop
const authenticateUser = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });
    if (user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);
      if (authenticated) {
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: {
      model: User,
      as: 'Owner',
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'] 
      }
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'] 
    }
  });
  res.json(courses);
}));

// GET /api/courses/:id 200 - Returns the course (including the user that owns the course) for the provided course ID
router.get('/:id', asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    include: {
      model: User,
      as: 'Owner',
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'] 
      }
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'] 
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
router.post('/', authenticateUser, asyncHandler(async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).location('/api/courses/' + course.id).end();
  } catch (error) {
    next(error);
  }
  
}));

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  // Check whether we've received an empty req object
  if (Object.keys(req.body).length === 0) {
    const error = new Error("Request JSON cannot be empty");
    error.status = 400;
    next(error);
  }

  let course;
  try {
    course = await Course.findByPk(req.params.id);
    if (course) {
      // Ensure the authenticated user is the matched course's owner
      if (course.userId == req.currentUser.id) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        const error = new Error("User not authorized to modify this record");
        error.status = 403;
        next(error);
      }
    } else {
      const error = new Error("Record not found");
      error.status = 500;
      next(error);
    }
  } catch (error) {
    next(error);
  }
}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    // Ensure the authenticated user is the matched course's owner
    console.log(course.userId, req.currentUser.id);
    if (course.userId == req.currentUser.id) {
      await course.destroy();
      res.status(204).end();
    } else {
      const error = new Error("User not authorized to modify this record");
      error.status = 403;
      next(error);
    }
  } else {
    const error = new Error("Record not found");
    error.status = 500;
    next(error);
  }
}));

module.exports = router;