import {deloGetDocumentsById, deloGetDocumentsPage, deloAddDocument} from '../services/deloService.js'
export const docsGetById = async (req,res) =>{
    const isnDoc = req.query.isnDoc;
    const response = await deloGetDocumentsById(isnDoc);
    console.log(`Response status of getDocumentsById request: ${response?.status}`)
    if(response?.status === undefined)
        res.status(200).json({message: "Succeed to get document by id!", result: response})
    else
        res.status(500).json({message: "Failed to get document by id!", result: response})

}

export const docsGetPage = async (req,res) =>{
    const documentsAmount = req.query.documentsAmount;
    const response = await deloGetDocumentsPage(documentsAmount);
    console.log(`Response status of getDocumentsPage request: ${response?.status}`)
    if(response?.status === undefined)
        res.status(200).json({message: "Succeed to get documents page!", result: response})
    else
        res.status(500).json({message: "Failed to get documents page!", result: response})
}

export const docCreate = async (req,res) =>{
    const { docClassifName, kindDoc, securlevel, corespName, isnDelivery,
        deloClassifName, addresseeSurname, addresseeDuty, filePath } = req.query;

    const response = await deloAddDocument(docClassifName, kindDoc, securlevel,
        corespName, isnDelivery, deloClassifName, addresseeSurname, addresseeDuty, filePath);
    console.log(`Response status of docCreate request: ${response?.status}`)
    if(response?.status === undefined)
        res.status(200).json({message: "Succeed to create document!", result: response})
    else
        res.status(500).json({message: "Failed to create document!", result: response})
}