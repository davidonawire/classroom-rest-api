'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models').sequelize;

// Set up our routes links
const users = require('./routes/users');
const courses = require('./routes/courses');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use(express.json());

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Establish our primary routes
app.use('/api/users', users);
app.use('/api/courses', courses);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => error.message).join(', ');
    err.message = 'Validation errors: ' + errors;
    err.status = 400;
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    err.message = 'Provided email address already registered';
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// Connect to database and start listening on our port
sequelize.sync()
  .then(() => {
    console.log('Connection to database successful.');
    const server = app.listen(app.get('port'), () => {
      console.log(`Express server is listening on port ${server.address().port}`);
    });
  })
  .catch((err) => console.error('Error on start-up:', err));

