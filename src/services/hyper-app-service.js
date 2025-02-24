
const _testURL = 'http://localhost:5000';
const _baseURL = 'https://hyper-app-api.onrender.com';

const _URL = _baseURL;

// Auth

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

// Exercises

export const getExercises = async (userId) => {
    try {
        const response = await fetch(`${_URL}/exercises/${userId}`);
        if (!response.ok) {
            throw new Error('Exercises not found');
        }
        const exercises = await response.json();
        return exercises;
    } catch (error) {
        console.error('Error fetching exercises:', error.message);
        throw error;
    }
};

export const addExercise = async (exerciseData) => {
    try {
        const response = await fetch(`${_URL}/exercises`, {
            method: 'POST', // Метод запроса
            headers: {
                'Content-Type': 'application/json', // Указываем, что тело запроса будет JSON
            },
            body: JSON.stringify(exerciseData), // Преобразуем данные программы в JSON
        });

        if (!response.ok) {
            throw new Error('Failed to add exercise');
        }

        return await response.json(); // Возвращаем созданную программу
    } catch (error) {
        console.error('Error adding exercise:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
};

export const deleteExercise = async (exerciseId) => {
    try {
        const response = await fetch(`${_URL}/exercises/${exerciseId}`, {
            method: 'DELETE', // Метод запроса
        });

        if (!response.ok) {
            throw new Error('Failed to delete exercise');
        }

        return { message: 'Exercise deleted successfully' };
    } catch (error) {
        console.error('Error deleting exercise:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
}

// Templates 

export const getTemplates = async (userId) => {
    try {
        const response = await fetch(`${_URL}/templates/${userId}`);
        if (!response.ok) {
            throw new Error('Templates not found');
        }
        const templates = await response.json();
        return templates;
    } catch (error) {
        console.error('Error fetching templates:', error.message);
        throw error;
    }
};

export const addTemplate = async (templateData) => {
    try {
        const response = await fetch(`${_URL}/templates`, {
            method: 'POST', // Метод запроса
            headers: {
                'Content-Type': 'application/json', // Указываем, что тело запроса будет JSON
            },
            body: JSON.stringify(templateData), // Преобразуем данные программы в JSON
        });

        if (!response.ok) {
            throw new Error('Failed to add template');
        }

        return await response.json(); // Возвращаем созданную программу
    } catch (error) {
        console.error('Error adding template:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
};

export const deleteTemplate = async (templateId) => {
    try {
        const response = await fetch(`${_URL}/templates/${templateId}`, {
            method: 'DELETE', // Метод запроса
        });

        if (!response.ok) {
            throw new Error('Failed to delete template');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting template:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
}

// Mesocycles 

export const getMesocycles = async (userId) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/${userId}`);
        if (!response.ok) {
            throw new Error('Mesocycles not found');
        }
        const mesocycles = await response.json();
        return mesocycles;
    } catch (error) {
        console.error('Error fetching mesocycles:', error.message);
        throw error;
    }
};

export const addMesocycle = async (mesocycleData) => {
    try {
        const response = await fetch(`${_URL}/mesocycles`, {
            method: 'POST', // Метод запроса
            headers: {
                'Content-Type': 'application/json', // Указываем, что тело запроса будет JSON
            },
            body: JSON.stringify(mesocycleData), // Преобразуем данные программы в JSON
        });

        if (!response.ok) {
            throw new Error('Failed to add mesocycle');
        }

        return await response.json(); // Возвращаем созданную программу
    } catch (error) {
        console.error('Error adding mesocycle:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
};

export const updateMesocycle = async (id, mesocycleData) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/${id}`, {
            method: 'PUT', // Метод запроса
            headers: {
                'Content-Type': 'application/json', // Указываем, что тело запроса будет JSON
            },
            body: JSON.stringify(mesocycleData), // Преобразуем данные программы в JSON
        });

        if (!response.ok) {
            throw new Error('Failed to update mesocycle');
        }

        return await response.json(); // Возвращаем созданную программу
    } catch (error) {
        console.error('Error updating mesocycle:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
}

export const deleteMesocycle = async (id) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/${id}`, {
            method: 'DELETE', // Метод запроса
        });

        if (!response.ok) {
            throw new Error('Failed to delete mesocycle');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding mesocycle:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
};

export const changeCurrentMesocycle = async (id, userId) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/change-current-meso/${id}/${userId}`, {
            method: 'PATCH', // Метод запроса
        });

        if (!response.ok) {
            throw new Error('Failed to change current mesocycle');
        }

        return await response.json(); // Возвращаем
    } catch (error) {
        console.error('Error changing current mesocycle:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
}

export const changeCurrentDay = async (id, dayId) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/change-current-day/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dayId }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to change current day');
        }

        return await response.json();
    } catch (error) {
        console.error('Error changing current day:', error.message);
        throw error;
    }
}

export const deleteExerciseFromCurrentDay = async (id, exerciseId) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/delete-exercise/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exerciseId }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to delete exercise');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting exercise:', error.message);
        throw error;
    }
}

export const addExerciseToCurrentDay = async (id, targetMuscleGroupId, exerciseId, notes) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/add-exercise/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ targetMuscleGroupId, exerciseId, notes }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to add exercise');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding exercise:', error.message);
        throw error;
    }
}

export const replaceExerciseInCurrentDay = async (id, exerciseId, targetMuscleGroupId, newExerciseId, notes) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/replace-exercise/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exerciseId, targetMuscleGroupId, newExerciseId, notes }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to replace exercise');
        }

        return await response.json();
    } catch (error) {
        console.error('Error replacing exercise:', error.message);
        throw error;
    }
}

export const moveExerciseInCurrentDay = async (id, exerciseId, direction) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/move-exercise/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exerciseId, direction }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to move exercise');
        }

        return await response.json();
    } catch (error) {
        console.error('Error moving exercise:', error.message);
        throw error;
    }
}

export const deleteSet = async (id, exerciseId, setId) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/delete-set/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exerciseId, setId }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to delete set');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting set:', error.message);
        throw error;
    }
}

export const addSet = async (id, exerciseId, setId) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/add-set/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exerciseId, setId }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to add set');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding set:', error.message);
        throw error;
    }
}

export const updateSet = async (id, exerciseId, set, isDone) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/update-set/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exerciseId, set, isDone }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to update set');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating set:', error.message);
        throw error;
    }
}

export const applyNotesToExercisesInMesocycle = async (id, exerciseId, notes) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/apply-notes/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exerciseId, notes }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to apply notes');
        }

        return await response.json();
    } catch (error) {
        console.error('Error apllying notes:', error.message);
        throw error;
    }
}

export const updateStatus = async (id, dayId, isDone) => {
    try {
        const response = await fetch(`${_URL}/mesocycles/update-status/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dayId, isDone }), // Преобразуем объект в строку
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating status:', error.message);
        throw error;
    }
}