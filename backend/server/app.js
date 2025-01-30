import dotenv from 'dotenv';
dotenv.config({path: './server/config/.env'});

import express from 'express';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import deloDocumentsRoute from "./routes/deloDocumentsRoute.js";
import redisClient from './services/redisService.js'
await redisClient.connect();

const app = express();
app.use(cookieParser());
app.use('/authentication',authRoute);
app.use('/documents',deloDocumentsRoute);

const server = app.listen(8000, () =>{
    console.log("Listening on port 8000");
});

const shutdown = async (signal) => {
    console.log(`Получен сигнал ${signal}, закрываем сервер...`);

    server.close(() => {
        console.log("Express сервер закрыт");
    });

    try {
        await redisClient.disconnect();
        console.log("Redis соединение закрыто");
    } catch (err) {
        console.error("Ошибка при закрытии Redis:", err);
    }

    process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", async (err) => {
    console.error("Необработанная ошибка:", err);
    await  shutdown("uncaughtException");
});