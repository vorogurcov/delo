import axios from "axios";

export const getEnumstore = async() =>{
    try{
        const carmaApiPath = 'http://localhost:8080';
        const json = {
            "mode": 37,
            "storeAddress": {
                "location": "sscu",
                "address": ""
            },
            "currentStores": [
                {
                    "location": "sscu",
                    "address": "",
                    "name": "MY"
                }
            ],
            "extInitParams": "SERVER=\"http://localhost:8080/\";",
            "clientId": "http://localhost:8000"
        }
        const response = await axios.post(carmaApiPath,json,{
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json',
            }

        })
        console.log(response?.data)
    }catch(error){
        console.log(error.message)
    }
}

export const getCert = async() =>{
    try{
        const carmaApiPath = 'http://localhost:8080';
        const json = {
            "mode": 38,
            "storeAddress": {
                "location": "sscu",
                "address": "",
                "name": "My"
            },
            "currentStores": [
                {
                    "location": "sscu",
                    "address": "",
                    "name": "MY"
                }
            ],
            "extInitParams": "SERVER=\"http://localhost:8080/\";",
            "clientId": "http://localhost:8000"
        }
        const response = await axios.post(carmaApiPath,json,{
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json',
            }
        })
        console.log(response?.data)
        return response?.data["certificates"]?.[0]
    }catch(error){
        console.log(error.message)
    }
}


export const signHash = async(cert, fileBase64) =>{
    try{
        const carmaApiPath = 'http://localhost:8080';
        const json = {
            "certInclude": 2,
            "mode": 56,
            "fileData": String(fileBase64),
            "senderCertId": String(cert),
            "currentStores": [
                {
                    "location": "sscu",
                    "address": "",
                    "name": "MY"
                }
            ],
            "extInitParams": "",
            "clientId": "http://localhost:8000",
            "uri": "",
            "isAttached": false
        }
        console.log(json);
        const response = await axios.post(carmaApiPath,json,{
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json',
            }
        })
        console.log(response?.data)
        return response?.data["fileData"];
    }catch(error){
        console.log("DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG")
        console.log(error.message);
        console.log(error.response);
        console.log(error.response?.["data"]["errors"]);
        console.log("DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG")
    }
}

