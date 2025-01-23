import express from 'express';
import {docsGetById, docsGetPage, docCreate} from "../controllers/documentsController.js";
const deloDocumentsRoute = express.Router();

deloDocumentsRoute.post('/getById',docsGetById);

deloDocumentsRoute.post('/getPage', docsGetPage);

deloDocumentsRoute.post('/createDocument', docCreate)
export default deloDocumentsRoute;