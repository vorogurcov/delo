import express from 'express';
import {loginToDelo, logoutFromDelo} from "../controllers/authController.js";

const authRoute = express.Router();

authRoute.post('/login',loginToDelo);

authRoute.post('/logout',logoutFromDelo);

export default authRoute;