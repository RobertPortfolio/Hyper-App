import { apiRequest } from './api-service';

// Получения всех мезоциклов пользователя
export const getMesocycles = async (userId) => {
    return apiRequest(
        `/mesocycles/${userId}`,
        'GET',
    );
};

// Добавление нового мезоцикла пользователя
export const addMesocycle = async (mesocycleData) => {
    return apiRequest(
        `/mesocycles`,
        'POST',
        mesocycleData,
    );
};

// Обновление объекта мезоцикла полностью
export const updateMesocycle = async (mesocycleData) => {
    return apiRequest(
        `/mesocycles/`,
        'PUT',
        mesocycleData,
    );
}

// Удаление мезоцикла
export const deleteMesocycle = async (mesocycleId) => {
    return apiRequest(
        `/mesocycles/${mesocycleId}`,
        'DELETE',
    );
};

// Выбрать другой мезоцикл текущим
export const changeCurrentMesocycle = async (mesocycleId, userId) => {
    return apiRequest(
        `/mesocycles/change-current-meso/`,
        'PATCH',
        { mesocycleId, userId },
    );
}

// Сменить текущий день в мезоцикле
export const changeCurrentDay = async (mesocycleId, dayId) => {
    return apiRequest(
        `/mesocycles/change-current-day/`,
        'PATCH',
        { mesocycleId, dayId },
    );
}

// Удалить упражнение из текущего дня 
export const deleteExerciseFromCurrentDay = async (mesocycleId, exerciseId) => {
    return apiRequest(
        `/mesocycles/delete-exercise/`,
        'PATCH',
        { mesocycleId, exerciseId },
    );
}

// Добавить упражнение в текущий день
export const addExerciseToCurrentDay = async (mesocycleId, targetMuscleGroupId, exerciseId, notes) => {
    return apiRequest(
        `/mesocycles/add-exercise/`,
        'PATCH',
        { mesocycleId, targetMuscleGroupId, exerciseId, notes },
    );
}

// Заменить упражнение в текущем дне
export const replaceExerciseInCurrentDay = async (mesocycleId, exerciseId, targetMuscleGroupId, newExerciseId, notes) => {
    return apiRequest(
        `/mesocycles/replace-exercise/`,
        'PATCH',
        { mesocycleId, exerciseId, targetMuscleGroupId, newExerciseId, notes },
    );
}

// Изменить индекс упражнения на одну позицию в зависимости от направления
export const moveExerciseInCurrentDay = async (mesocycleId, exerciseId, direction) => {
    return apiRequest(
        `/mesocycles/move-exercise/`,
        'PATCH',
        { mesocycleId, exerciseId, direction },
    );
}

// Удалить подход в упражнении в текущем дне мезоцикла
export const deleteSet = async (mesocycleId, exerciseId, setId) => {
    return apiRequest(
        `/mesocycles/delete-set/`,
        'PATCH',
        { mesocycleId, exerciseId, setId },
    );
}

// Добавить подход в упражнении в текущем дне мезоцикла 
// (если setId равен null подход добавиться в конце остальных подходов упражнения)
// (если setId имеет значение подход добавиться под подходом с _id === setId)
export const addSet = async (mesocycleId, exerciseId, setId) => {
    return apiRequest(
        `/mesocycles/add-set/`,
        'PATCH',
        { mesocycleId, exerciseId, setId },
    );
}

// Обновить подход в упражнении в текущем дне мезоцикла 
export const updateSet = async (mesocycleId, exerciseId, set, isDone) => {
    return apiRequest(
        `/mesocycles/update-set/`,
        'PATCH',
        { mesocycleId, exerciseId, set, isDone },
    );
}

// Изменить заметки у упражнения во всем мезоцикле
export const applyNotesToExercisesInMesocycle = async (mesocycleId, exerciseId, notes) => {
    return apiRequest(
        `/mesocycles/apply-notes/`,
        'PATCH',
        { mesocycleId, exerciseId, notes },
    );
}

// Проверить и обновить статус дня и мезоцикла
export const updateStatus = async (mesocycleId, dayId, isDone) => {
    return apiRequest(
        `/mesocycles/update-status/`,
        'PATCH',
        { mesocycleId, dayId, isDone },
    );
}