import redis from 'redis';

const client = redis.createClient();
export default {
    connect: async () => {
        try {
            await client.connect();
            console.log('Redis подключен');
        } catch (err) {
            console.error('Ошибка при подключении к Redis:', err);
            throw err;
        }
    },

    disconnect: async () => {
        try {
            await client.disconnect();
            console.log('Redis отключен');
        } catch (err) {
            console.error('Ошибка при отключении от Redis:', err);
            throw err;
        }
    },

    get: async (key) => {
        try {
            const data = await client.get(key);
            console.log(`Получено значение для ключа ${key}:`, data);
            return data;
        } catch (err) {
            console.error(`Ошибка при получении ключа ${key}:`, err);
            throw err;
        }
    },

    set: async (key, value) => {
        try {
            await client.set(key, value);
            console.log(`Установлено значение для ключа ${key}:`, value);
        } catch (err) {
            console.error(`Ошибка при установке данных ${key}:${value}:`, err);
            throw err;
        }
    },

    del: async (key) => {
        try {
            await client.del(key);
            console.log(`Удалено значение для ключа ${key}`);
        } catch (err) {
            console.error(`Ошибка при удалении ключа ${key}:`, err);
            throw err;
        }
    }
};