require('dotenv').config({path: "./config/.env"});;
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute.js");
const deloDocumentsRoute = require("./routes/deloDocumentsRoute.js");


const app = express();
app.use(cookieParser());
app.use('/authentication',authRoute);
app.use('/documents',deloDocumentsRoute);

app.listen(8000,() =>{
    console.log("Listening on port 8000");
});