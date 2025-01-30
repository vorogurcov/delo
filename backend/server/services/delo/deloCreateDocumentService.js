import getDeloConfig from "../../config/deloServerConfig.js";
import makePostRequest from "./deloApiRequest.js";
import {uploadFileToFDULZ,getBase64} from "./deloFdulzService.js";
import {getCert, getEnumstore, signHash} from "../carma/carmaElecSignService.js";

const getDueDocgroup = async(docClassifName) =>{
    const deloConfig = getDeloConfig();

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
        .then(response => response.data)
    return result['data']['docgroupClsPg']['items']?.[0]['due'];
}

const getIsnLclassif = async (classifName) =>{
    const deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = ` query{
        nomenklClsPg(filter : {classifName: {equal: {value: ${classifName}}}},first:1000){
            items{
                isnLclassif
            }
        }
    }`
    const result = await makePostRequest(fullApiPath, {query},'getIsnLclassif')
        .then(response => response.data)
    return result['data']['nomenklClsPg']['items']?.[0]['isnLclassif'];

}


const getOrganizDueAndIsnNode = async (classifName) =>{
    const deloConfig = getDeloConfig();

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
        .then(response => response.data)
    return [result['data']['organizClsPg']['items']?.[0]['due'],
        result['data']['organizClsPg']['items']?.[0]['isnNode'] ];
}

const getIsnContact = async(isnOrganiz) =>{
    const deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const query = `query {
        contactsPg(filter: { isnOrganiz: {equal: {value:${isnOrganiz}} }}, first: 2) {
            items {
                isnContact
            }
        }
    }`

    const result = await makePostRequest(fullApiPath, {query},'getOrganizDueAndIsnNode')
        .then(response => response.data)
    return result['data']['contactsPg']['items']?.[0]['isnContact'];
}

const getAddresseeDue = async (addresseeSurname, addresseeDuty) =>{
    const deloConfig = getDeloConfig();

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
        .then(response => response.data)
    return result['data']['departmentsPg']['items']?.[0]['due'];
}
const deloAddDocument = async(docClassifName, kindDoc, securlevel,
                                     corespName, isnDelivery, deloClassifName, addresseeSurname, addresseeDuty,filePath) =>{
    const deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/gql/query/";
    const dueDocgroup = await getDueDocgroup(docClassifName);
    const isnLclassif = await getIsnLclassif(deloClassifName)
    const organiz = await getOrganizDueAndIsnNode(corespName);
    const isnContact = await getIsnContact(organiz[1])
    const addresseeDue = await getAddresseeDue(addresseeSurname,addresseeDuty);
    const fdulzID = await uploadFileToFDULZ(filePath) || filePath;

    await getEnumstore();

    const cert = await getCert();
    const fileBase64 = await getBase64(fdulzID);
    const fileData = await signHash(cert,fileBase64);
    console.log("DATADATA\n",fileData,"DATADATA\n");
    console.log()

    // refFileEds:[
    //     {
    //     createRefFileEds:{
    //       idCertificate: "-1",
    //       edsData: \"${fileData}\"
    //       }
    //     }
    //   ]

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
                      description: \"${filePath}\",
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
        .then(response => response.data)
}

export default deloAddDocument;