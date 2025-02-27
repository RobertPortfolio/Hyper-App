import { _URL } from '../config';

// Базовая функция для обращения к серверу
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${_URL}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка API запроса:', error.message);
        throw error;
    }
};