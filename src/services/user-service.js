import { _URL } from '../config';

// Регистрация пользователя
export const register = async (userData) => {
    const response = await fetch(`${_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка регистрации: ${errorData.error}`);
    }
    const data = await response.json();

    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
}

// Авторизация пользователя
export const login = async (credentials) => {
    const response = await fetch(`${_URL}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка входа: ${errorData.error}`);
    }
    const data = await response.json();
    // Сохранение токена в localStorage
    if (data.token) {
        localStorage.setItem('token', data.token);
    }

    return data;
}

// Выход пользователя
export const logout = async () => {
    const response = await fetch(`${_URL}/users/logout`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Error during logout');
    }
    const data = await response.json();

    // Удаляем токен из localStorage
    localStorage.removeItem('token');
    return data;
}

// Проверка токена
export const fetchCurrentUser = async (token) => {
    if (!token) {
        throw new Error('Токен не найден');
    }

    const response = await fetch(`${_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Не удалось получить текущего пользователя');
    }

    return await response.json();
};