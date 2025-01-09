import axios from 'axios';
import getDeloConfig from "../config/deloServerConfig.js";

let deloConfig = undefined;
let sessionCookies = {};
const makePostRequest = async (path, data, operationName) =>{
    try {
        console.log("Making POST request to:", path);
        console.log("\nRequest Data:", data);

        const cookies = sessionCookies?.[deloConfig['user_login']];

        const result = await axios.post(path, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': cookies?.join('; '),
            }
        });

        if(Object.keys(sessionCookies).length === 0) {
            const cookies = result.headers['set-cookie'];
            sessionCookies[deloConfig['user_login']] = cookies;
        }
        console.log(`${operationName} Successful:`, result.data);
        return result.data;
    } catch (error) {
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        } else if (error.request) {
            console.error("No Response Received:", error.request);
        } else {
            console.error("Request Error:", error.message);
        }
        return error;
    }
}
export const deloLogin = async () => {
    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullLoginPath = deloConfig['baseURL'] + "/CoreHost/identity/api/login";
    const data =
        {
            user: deloConfig['user_login'],
            password: deloConfig['user_password']
        };

    return await makePostRequest(fullLoginPath,data,"Login");
};
export const deloLogout = async () => {
    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullLogoutPath = deloConfig['baseURL'] + "/CoreHost/identity/api/logout";
    const data = {}

    const response = await makePostRequest(fullLogoutPath,data,"Logout");
    sessionCookies = {};
    return response;
};
export const deloGetDocumentsById = async(isnDoc) =>{
    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = `
        query {
            getDocRc(isnDoc: ${isnDoc}) {
                isnDoc
                docDate
            }   
        }`;

    return await makePostRequest(fullApiPath, {query}, "GetDocsById");
}
export const deloGetDocumentsPage = async(documentsAmount) =>{
    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

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
}