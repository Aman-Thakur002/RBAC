const express = require('express')
const UserController = require('../controller/users.controller.js')
const auth = require('../middleware/auth.js')
const {checkSchema} = require('express-validator')
import validate from "../middleware/validation";
const { userValidation, userLoginValidation } = require('../validations/users.js');

const api = express.Router();
api.post(
  "/login",
  [checkSchema(userLoginValidation), validate],
  UserController.logInAdmin
);

api.post(
  "/verify-otp",
  UserController.verifyOtp
);

api.post(
  "/",
  auth.ensureAuth("Admin"),
  [checkSchema(userValidation), validate],
  UserController.createUser
);

api.get("/", auth.ensureAuth("Admin", "Guest"), UserController.getUsers);

api.delete(
  "/:id",
  auth.ensureAuth("Admin", "User"),
  UserController.deleteUser
);

module.exports = api;
