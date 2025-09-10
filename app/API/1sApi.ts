// files1sApi.ts
import { apiClient, handleResponse, handleError } from './apiClient';

export const checkFiles = async (): Promise<void> => {
  try {
    const response = await apiClient.get('/files1s/check');
    const message = response.data.message
    handleResponse(response, message ? message : 'Проверка файлов запущена');

  } catch (err) {
    handleError(err, 'Ошибка при проверке файлов');
  }
};

export const getFilesList = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/files1s');
    return handleResponse(response);
  } catch (err) {
    handleError(err, 'Ошибка при получении списка файлов');
    return [];
  }
};

export const refreshFilesList = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/files1s/refresh');
    return handleResponse(response, 'Список файлов обновлён');
  } catch (err) {
    handleError(err, 'Ошибка при обновлении списка файлов');
    return [];
  }
};