import express from 'express';
import {docsGetById, docsGetPage} from "../controllers/documentsController.js";
const deloDocumentsRoute = express.Router();

deloDocumentsRoute.post('/getById',docsGetById);

deloDocumentsRoute.post('/getPage', docsGetPage);

export default deloDocumentsRoute;