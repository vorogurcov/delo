export default function getDeloConfig() {
    return {
        baseURL: process.env.DELO_BASE_URL,
        user_login: process.env.DELO_USER_LOGIN,
        user_password: process.env.DELO_USER_PASSWORD,
    };
}