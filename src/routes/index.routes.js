const express = require('express')

const api = express.Router();

api.use('/users', require('./users.routes')); // Use the imported route handler

module.exports = api
