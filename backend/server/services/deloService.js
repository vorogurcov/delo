import axios from 'axios';
import getDeloConfig from "../config/deloServerConfig.js";
import FormData from 'form-data';
import fs from 'fs';
import mime from 'mime-types'


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
        }
        if (error.request) {
            console.error("No Response Received:", error.request);
        }
        console.error("Request Error:", error.message);
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
    await getDueDocgroup("Общие");
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

const getDueDocgroup = async(docClassifName) =>{
    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = `
    query {
      docgroupClsPg(filter: { classifName: {equal: {value:${docClassifName}} }}, first: 10000) {
        items { 
          due
        }
      }
    }`
    const result = await makePostRequest(fullApiPath, {query},'GetDocsPage')
    return result['data']['docgroupClsPg']['items']?.[0]['due'];
}

const getIsnLclassif = async (classifName) =>{
    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = ` query{
        nomenklClsPg(filter : {classifName: {equal: {value: ${classifName}}}},first:1000){
            items{
                isnLclassif
            }
        }
    }`
    const result = await makePostRequest(fullApiPath, {query},'getIsnLclassif')
    return result['data']['nomenklClsPg']['items']?.[0]['isnLclassif'];

}


const getOrganizDueAndIsnNode = async (classifName) =>{
    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = `query{
        organizClsPg(filter: { classifName: {equal: {value:${classifName} }}}, first: 2) {
            items {
                due
                isnNode
            }
        }
    }`

    const result = await makePostRequest(fullApiPath, {query},'getOrganizDueAndIsnNode')
    return [result['data']['organizClsPg']['items']?.[0]['due'],
            result['data']['organizClsPg']['items']?.[0]['isnNode'] ];
}

const getIsnContact = async(isnOrganiz) =>{
    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = `query {
        contactsPg(filter: { isnOrganiz: {equal: {value:${isnOrganiz}} }}, first: 2) {
            items {
                isnContact
            }
        }
    }`

    const result = await makePostRequest(fullApiPath, {query},'getOrganizDueAndIsnNode')
    return result['data']['contactsPg']['items']?.[0]['isnContact'];
}

const getAddresseeDue = async (addresseeSurname, addresseeDuty) =>{

    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = `
    query{
      departmentsPg(filter:{surname:{equal:{value:${addresseeSurname}}},
            duty:{equal:{value:${addresseeDuty}}}}
                ,first: 1000){
                    items{
                        due
                    }
        }
    }`
    const result = await makePostRequest(fullApiPath, {query},'getAddresseeDue')
    return result['data']['departmentsPg']['items']?.[0]['due'];
}

const uploadFileToFDULZ = async (fileName) => {

    if (deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/fdulz/api/UploadFiles"; 
    const filePath = "server/" + fileName;

    const formData = new FormData();
    formData.append('PostedFiles[]', fs.createReadStream(filePath), fileName);

    try {
        const response = await axios.post(fullApiPath, formData, {
            headers: {
                ...formData.getHeaders(),
                'Cookie': sessionCookies?.[deloConfig['user_login']]?.join('; '),
                'Accept': 'text/plain, */*; q=0.01',
                'User-Agent': 'Node.js FormData Upload',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Disposition': `form-data; name="PostedFiles[]"; filename="${fileName}"`,
            },
            withCredentials: true,
        });

        console.log("Ответ сервера:", response.data);
        return response.data.slice(0,-1)
    } catch (error) {
        console.log("DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG")
        console.log(error.message);
        console.log(formData);
        console.log(error.response);
        console.log(error.response?.["data"]["errors"]);
        console.log("DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG")
    }

    return undefined;
};


export const deloAddDocument = async(docClassifName, kindDoc, securlevel,
                                     corespName, isnDelivery, deloClassifName, addresseeSurname, addresseeDuty,filePath) =>{
    if(deloConfig === undefined)
        deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const dueDocgroup = await getDueDocgroup(docClassifName);
    const isnLclassif = await getIsnLclassif(deloClassifName)
    const organiz = await getOrganizDueAndIsnNode(corespName);
    const isnContact = await getIsnContact(organiz[1])
    const addresseeDue = await getAddresseeDue(addresseeSurname,addresseeDuty);
    const fdulzID = await uploadFileToFDULZ(filePath) || filePath;

    const query = `
        mutation {
          createDocRc(input: { 
            clientMutationId: "11",
            data: { 
              kindDoc: ${kindDoc}, 
              dueDocgroup: \"${dueDocgroup}\", 
              securlevel: ${securlevel}, 
              docDate: \"${new Date().toISOString().slice(0, -14)}\",
              refCorresps: [
                { 
                  createRefCorresp: {
                    dueOrganiz: \"${organiz[0]}\",
                    isnContact: ${isnContact},
                    correspKind:Correspondent
                  }
                }
              ],
              isnDelivery: ${isnDelivery},
              nomenklCl:{
                attachNomenklCl:{
                  isnLclassif:${isnLclassif}
                },
                }
                docWho:[
                    {
                      createDocWho:{
                        duePerson:\"${addresseeDue}\"
                      }
                    }
                  ],
                refFiles:[
                    {
                      createRefFile:{
                      contents: "fdulz#DeleteOnClose#${fdulzID}",
                      description: \"${filePath}\"
                      }
                    }
                    ]
            }
          }) {
            success
            message
            messageCode
            messageData
            systemMessage
            }
        }`

    return await makePostRequest(fullApiPath, {query}, 'AddDocument')
}

