import redisClient from "../redisService.js";
import axios from "axios";
import getDeloConfig from "../../config/deloServerConfig.js";

const makePostRequest = async (path, data, operationName) =>{
    const deloConfig = getDeloConfig()
    try {
        console.log("Making POST request to:", path);
        console.log("Request Data:", data);

        const cookies = await redisClient.get(deloConfig['user_login'])

        const result = await axios.post(path, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': cookies,
            }
        });

        console.log(`${operationName} Successful:`, result.data);
        return result;
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
export default makePostRequest;