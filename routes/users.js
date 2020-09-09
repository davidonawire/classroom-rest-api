const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

const router = express.Router();
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

// GET /api/users 200 - Returns the currently authenticated user
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.json({ 
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
}));

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', asyncHandler(async (req, res, next) => {
  // Check whether we've received an empty req object
  if (Object.keys(req.body).length === 0) {
    const error = new Error("Request JSON cannot be empty");
    error.status = 400;
    next(error);
  }

  try {
    const user = req.body;

    // Hash the user's password
    user.password = bcryptjs.hashSync(user.password);

    await User.create(user);
    res.status(201).location('/').end();
  } catch (error) {
    next(error);
  }
}));

module.exports = router;