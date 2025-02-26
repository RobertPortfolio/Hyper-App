import { apiRequest } from './api-service';

export const getExercises = async (userId) => {
    return apiRequest(
        `/exercises/${userId}`,
        'GET',
    );
};

export const addExercise = async (exerciseData) => {
    return apiRequest(
        `/exercises`,
        'POST',
        exerciseData,
    );
};

export const deleteExercise = async (exerciseId) => {
    return apiRequest(
        `/exercises/${exerciseId}`,
        'DELETE',
    );
}