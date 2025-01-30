import redisClient from '../redisService.js';
import getDeloConfig from "../../config/deloServerConfig.js";
import makePostRequest from "./deloApiRequest.js";

export const deloLogin = async () => {
    const deloConfig = getDeloConfig();

    const fullLoginPath = deloConfig['baseURL'] + "/CoreHost/identity/api/login";
    const data =
        {
            user: deloConfig['user_login'],
            password: deloConfig['user_password']
        };

    const response = await makePostRequest(fullLoginPath,data,"Login");
    await redisClient.set(deloConfig['user_login'], String(response.headers['set-cookie']));
    return response.data;
};
export const deloLogout = async () => {
    const deloConfig = getDeloConfig();

    const fullLogoutPath = deloConfig['baseURL'] + "/CoreHost/identity/api/logout";
    const data = {}

    const response = await makePostRequest(fullLogoutPath,data,"Logout");
    await redisClient.del(deloConfig['user_login']);
    return response.data;
};
