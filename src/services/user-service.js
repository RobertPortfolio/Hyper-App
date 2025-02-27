import { _URL } from '../config';

// Регистрация пользователя
export const register = async (userData) => {
    const response = await fetch(`${_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include', // ✅ Передаёт куки с токеном
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка регистрации: ${errorData.error}`);
    }

    return await response.json(); // ✅ Теперь токен не нужен в ответе, кука уже установлена
};

export const login = async (credentials) => {
    const response = await fetch(`${_URL}/users/login`, {
        method: 'POST',
        credentials: 'include', // ✅ Куки теперь автоматически передаются
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка входа: ${errorData.error}`);
    }

    return await response.json(); // ✅ Токен не нужен, сервер сам хранит его в куках
};

export const logout = async () => {
    await fetch(`${_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include', // ✅ Чтобы кука удалилась на сервере
    });
};

export const fetchCurrentUser = async () => {
    const response = await fetch(`${_URL}/users/me`, {
        method: 'GET',
        credentials: 'include', // ✅ Берёт токен из куки автоматически
    });

    if (!response.ok) {
        throw new Error('Не удалось получить текущего пользователя');
    }

    return await response.json();
};