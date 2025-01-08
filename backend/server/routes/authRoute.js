const express = require('express')
const auth = require('../controllers/authController.js');
const authRoute = express.Router();

authRoute.post('/login',auth.loginToDelo);

authRoute.post('/logout',auth.logoutFromDelo);

module.exports = authRoute;