const express = require('express');
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

// GET /api/users 200 - Returns the currently authenticated user


// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

module.exports = router;