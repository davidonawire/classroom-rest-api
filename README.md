
# Courses REST API

A REST API representing a simple relational database structure of courses and associated teachers. The API is built on Node.js, Express, Sequelize, and a SQLite database, and incorporates user authentication and authorization through Basic Auth.

The following routes are defined:

* `GET /API/courses` - Returns a list of all courses
* `GET /API/courses/:course-id` - Returns the course specified by `course-id`
* `POST /API/courses` - REQUIRES AUTH - Creates a new course
* `PUT /API/courses/:course-id` - REQUIRES AUTH - Updates a course specified by `course-id`. Auth must match course owner.
* `DELETE /API/courses/:course-id` - REQUIRES AUTH - Deletes a course specified by `course-id`. Auth must match course owner.
* `GET /API/users` - REQUIRES AUTH - Returns currently authenticated user
* `POST /API/users` - Creates a new user

## Installation and Launch

Run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
