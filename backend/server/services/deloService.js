const axios = require("axios");
const deloServerConfig = require("../config/deloServerConfig.js")

let sessionCookies = {};
const makePostRequest = async (path, data, operationName) =>{
    try {
        console.log("Making POST request to:", path);
        console.log("\nRequest Data:", data);

        const cookies = sessionCookies?.[deloServerConfig['user_login']];

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
            sessionCookies[deloServerConfig['user_login']] = cookies;
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
const Login = async () => {
    const fullLoginPath = deloServerConfig['baseURL'] + "/CoreHost/identity/api/login";
    const data =
        {
            user: deloServerConfig['user_login'],
            password: deloServerConfig['user_password']
        };

    return await makePostRequest(fullLoginPath,data,"Login");
};
const Logout = async () => {
    const fullLogoutPath = deloServerConfig['baseURL'] + "/CoreHost/identity/api/logout";
    const data = {}

    const response = await makePostRequest(fullLogoutPath,data,"Logout");
    sessionCookies = {};
    return response;
};
const GetDocumentsById = async(isnDoc) =>{
    const fullApiPath = deloServerConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = `
        query {
            getDocRc(isnDoc: ${isnDoc}) {
                isnDoc
                docDate
            }   
        }`;

    return await makePostRequest(fullApiPath, {query}, "GetDocsById");
}
const GetDocumentsPage = async(documentsAmount) =>{
    const fullApiPath = deloServerConfig['baseURL'] + "/CoreHost/gql/query/";
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

module.exports.deloLogin = Login;
module.exports.deloLogout = Logout;
module.exports.deloGetDocumentsById = GetDocumentsById;
module.exports.deloGetDocumentsPage = GetDocumentsPage;