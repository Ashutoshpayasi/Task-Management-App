# User and Task Management API
This project is an implementation of a RESTful API for managing users and tasks with security features like role-based access control (RBAC) and OTP-based email verification. The API is built using Node.js, Express, and MongoDB.

# Features
## User Management
# User Registration:
 Users can register by providing their details. The API ensures that each email is unique.

# Login: 
Authenticated using JWT, with secure password hashing.

OTP Verification: Users receive an OTP for email verification.
Password Reset: Users can request a password reset, and the API verifies the reset token.
# CRUD Operations:
 Admins have full access to manage all users.
## Task Management
Task Creation: Users can create tasks, specifying title, description, status, and assignees.
Task Update and Deletion: Users can update or delete tasks as per their permissions.
Task Retrieval: View all tasks or fetch specific tasks by ID.
## Role-Based Access Control (RBAC)
Admin: Full access to all endpoints, including user management and task assignment.
Manager: Can manage tasks and view user profiles within their team.
## User: 
Can manage their own tasks and view their own profile.
## Technologies Used
Node.js: Server-side JavaScript runtime.
Express.js: Web application framework for handling API routes.
MongoDB: NoSQL database for storing user and task data.
JWT: For secure user authentication.
bcrypt: For hashing passwords.
# Installation
Clone the repository:
bash
Copy code
git clone https://github.com/Ashutoshpayasi/Task-Management-App.git
Navigate to the project directory:
bash
Copy code
cd your-repo
## Install dependencies:
bash
Copy code
npm install
Set up environment variables in a .env file:
env
Copy code
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
# Start the server:
bash
Copy code
npm start
# API Endpoints

# User Endpoints
POST /user/register: Register a new user.
POST /user/verifyotp: Verify the OTP sent to the user's email.
POST /user/resendotp: Resend the OTP for email verification.
POST /user/login: Authenticate a user and return a JWT.
GET /user/getalluser: Retrieve all users (Admin only).
GET /user/{id}: Retrieve a specific user by ID.
PUT /user/{id}: Update a user's details.
DELETE /user/{id}: Delete a user by ID.
POST /user/resetpassword: Request a password reset.
POST /user/reset-password/{token}: Reset the password using a token.
GET /verify-email/{token}: Verify a user's email using a token.

# Task Endpoints
POST /tasks: Create a new task.
GET /tasks: Retrieve all tasks.
PATCH /tasks/{id}: Update a task by ID.
DELETE /tasks/{id}: Delete a task by ID.
Role-Based Access Control
Role-based access control ensures that only users with appropriate permissions can access specific endpoints.

# Project Structure
models/: Contains Mongoose models for User and Task.
routes/: Defines API routes for user and task management.
controllers/: Business logic for handling requests.
middleware/: Custom middleware for authentication and RBAC.
config/: Configuration files, including database connection.
# Security Features
JWT Authentication: Ensures that only authenticated users can access protected endpoints.
Password Hashing: Passwords are hashed using bcrypt before being stored in the database.
Input Validation: Using middleware to validate incoming data.
Running Tests
To run tests, use the following command:

bash
Copy code
npm test
# Future Enhancements
Implement additional role-specific features.
Add more robust input validation and error handling.
Integrate with a frontend application for a complete user experience.
