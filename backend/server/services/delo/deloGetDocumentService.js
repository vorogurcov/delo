import getDeloConfig from '../../config/deloServerConfig.js';
import makePostRequest from "./deloApiRequest.js";

export const deloGetDocumentsById = async(isnDoc) =>{
    const deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = `
        query {
            getDocRc(isnDoc: ${isnDoc}) {
                isnDoc
                docDate
            }   
        }`;

    return await makePostRequest(fullApiPath, {query}, "GetDocsById")
        .then(response => response.data);
}
export const deloGetDocumentsPage = async(documentsAmount) =>{
    const deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = `
        query {
            docRcsPg(first: ${documentsAmount}, after: null) {
                items {
                    isnDoc
                    docDate
                    
                }
            }
        }
    `;
    return await makePostRequest(fullApiPath, {query},'GetDocsPage')
        .then(response => response.data)
}


