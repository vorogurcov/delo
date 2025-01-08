const express = require('express')
const documentsController = require("../controllers/documentsController.js")

const deloDocumentsRoute = express.Router();

deloDocumentsRoute.post('/getById',documentsController.getById);

deloDocumentsRoute.post('/getPage', documentsController.getPage);

module.exports = deloDocumentsRoute;