import dotenv from 'dotenv';
dotenv.config({path: './config/.env'});

import express from 'express';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import deloDocumentsRoute from "./routes/deloDocumentsRoute.js";

const app = express();
app.use(cookieParser());
app.use('/authentication',authRoute);
app.use('/documents',deloDocumentsRoute);

app.listen(8000,() =>{
    console.log("Listening on port 8000");
});