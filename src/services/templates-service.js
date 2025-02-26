import { apiRequest } from './api-service';

export const getTemplates = async (userId) => {
    return apiRequest(
        `/templates/${userId}`,
        'GET',
    );
};

export const addTemplate = async (templateData) => {
    return apiRequest(
        `/templates`,
        'POST',
        templateData
    );
};

export const deleteTemplate = async (templateId) => {
    return apiRequest(
        `/templates/${templateId}`,
        'DELETE',
    );
}