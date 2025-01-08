const axios = require("axios");
const deloServerConfig = require("../config/deloServerConfig.js")

let sessionCookies = {};
const deloLogin = async () => {
    const fullLoginPath = deloServerConfig['baseURL'] + "/CoreHost/identity/api/login";

    try {
        console.log("Making POST request to:", fullLoginPath);
        console.log("Request Data:", {
            user: deloServerConfig['user_login'],
            password: deloServerConfig['user_password']
        });

        const result = await axios.post(fullLoginPath, {
            user: deloServerConfig['user_login'],
            password: deloServerConfig['user_password']
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        const cookies = result.headers['set-cookie'];
        sessionCookies[deloServerConfig['user_login']] = cookies;

        console.log("Response Data:", result.data);
        return result.data;
    } catch (error) {
        if (error.response) {
            // Сервер ответил с ошибкой
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        } else if (error.request) {
            // Запрос был отправлен, но ответа не было
            console.error("No Response Received:", error.request);
        } else {
            // Ошибка при настройке запроса
            console.error("Request Error:", error.message);
        }
        return error;

    }
};

const deloLogout = async () => {
    const logoutPath = deloServerConfig['baseURL'] + "/CoreHost/identity/api/logout";

    try {
        console.log("Making POST request to:", logoutPath);

        // Предполагается, что cookies сохраняются в памяти после логина
        const cookies = sessionCookies[deloServerConfig['user_login']];

        const result = await axios.post(logoutPath, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': cookies.join('; '), // Передача сохраненных cookies
            }
        });

        console.log("Logout Successful:", result.data);
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
};

module.exports.deloLogin = deloLogin;
module.exports.deloLogout = deloLogout;