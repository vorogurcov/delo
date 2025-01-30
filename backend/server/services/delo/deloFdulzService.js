import getDeloConfig from "../../config/deloServerConfig.js";
import FormData from "form-data";
import fs from "fs";
import redisClient from "../redisService.js";
import axios from "axios";

export const uploadFileToFDULZ = async (fileName) => {
    const deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + "/CoreHost/fdulz/api/UploadFiles";
    const filePath = "server/" + fileName;

    const formData = new FormData();
    formData.append('PostedFiles[]', fs.createReadStream(filePath), fileName);

    const cookies = await redisClient.get(deloConfig['user_login'])

    try {
        const response = await axios.post(fullApiPath, formData, {
            headers: {
                ...formData.getHeaders(),
                'Cookie': cookies,
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
        console.log(error.response?.["data"]["errors"]);
        console.log("DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG")
    }

    return undefined;
};

export const getBase64 = async (fileName) => {
    const deloConfig = getDeloConfig();

    const fullApiPath = deloConfig['baseURL'] + `/CoreHost/FOP/FdulzBase64HashAlg/${fileName}`;

    const queryParams = {
        hashAlg: '1.3.14.3.2.26',
        card_id: '',
        cabinet_id: '',
        current_dl: ''

    }

    const cookies = await redisClient.get(deloConfig['user_login'])

    try {
        const response = await axios.get(fullApiPath, {
            params: queryParams,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': cookies,
                'X-Requested-With': 'XMLHttpRequest'
            },

        });

        console.log("Ответ сервера:", response.data);
        return response.data
    } catch (error) {
        console.log("DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG")
        console.log(error.message);
        console.log(error.response?.["data"]["errors"]);
        console.log("DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG")
    }

    return undefined;
};
