# Role-Based Access Control (RBAC) Application
This repository contains a basic Role-Based Access Control (RBAC) application built with Node.js and MySQL. It manages user roles and permissions, ensuring secure access to application resources.

## 🚀 Features
Role-Based Permissions: Assign roles (e.g., Admin, Staff) with specific permissions.
JWT Authentication: Secure session management with JSON Web Tokens.
OTP Verification: Secure login using SendGrid's OTP service.
Admin Dashboard: Admins have global permissions to manage the system.
Postman Collection: Predefined Postman requests for easy testing.

## 🛠️ Setup Instructions
**Step 1: Install Prerequisites**
Install MySQL and XAMPP.
Install Node.js if not already installed.

**Step 2: Clone the Repository**
```bash
git clone https://github.com/<your-username>/<repository-name>.git
cd <repository-name>
```
**Step 3: Install Dependencies**
```bash
npm install
```
**Step 4: Update Environment Variables**
Add the following key in the .env file:
env
```bash
OTP_API_KEY="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"
```
**Step 5: Run Migrations and set up admin**
Run the following command to set up the database schema:
```bash
npm run migrate:up
npm run setup-admin
```

**Step 6: Start the Server**
Start the development server:
 ```bash
npm run dev
```

**Step 8: Import Postman Collection**
Import the provided Postman collection located in the codebase:
VRV_RBAC Backend.postman_collection.json.
Use it to test API requests.

## 📋 Postman Usage
Admin Login
Use the admin-login request to log in as an Admin. Admins have global permissions.

Create a Staff User
Use the create-user request to add a staff member.

Staff Login
Log in using the staff's email and password. An OTP will be sent to the staff's registered email.

Retrieve OTP
If the email is not received, check the users table in the database for the OTP. (Refer to the SendGrid Documentation to generate a new API key if needed.)

Verify OTP
Use the verify-otp request to complete the login process.

## 🛡️ Authentication & Authorization
JWT Tokens
Secure sessions are managed using JWT tokens.
Middleware Authorization
The middleware src/middleware/auth.js ensures that users have the necessary permissions to access specific resources.

## 🧰 Technologies Used
Backend: Node.js, Express.js
Database: MySQL
Authentication: JSON Web Tokens (JWT)
Email Service: SendGrid

## 🐛 Troubleshooting
If OTP emails are not received, verify your OTP_API_KEY in the .env file. Refer to SendGrid's Documentation for assistance.
