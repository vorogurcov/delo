const deloService = require('../services/deloService.js');

const getById = async (req,res) =>{
    const isnDoc = req.query.isnDoc;
    const response = await deloService.deloGetDocumentsById(isnDoc);
    console.log(`Response status of getDocumentsById request: ${response?.status}`)
    if(response?.status === undefined)
        res.status(200).json({message: "Succeed to get document by id!", result: response})
    else
        res.status(500).json({message: "Failed to get document by id!", result: response})

}

const getPage = async (req,res) =>{
    const documentsAmount = req.query.documentsAmount;
    const response = await deloService.deloGetDocumentsPage(documentsAmount);
    console.log(`Response status of getDocumentsPage request: ${response?.status}`)
    if(response?.status === undefined)
        res.status(200).json({message: "Succeed to get documents page!", result: response})
    else
        res.status(500).json({message: "Failed to get documents page!", result: response})
}

module.exports.getById = getById;
module.exports.getPage = getPage;