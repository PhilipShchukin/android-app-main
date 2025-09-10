import { apiClient, handleResponse, handleError } from './apiClient';

export const getSettingsFileContent = async (filename: string = 'settings.json'): Promise<string | undefined> => {
  try {
    const response = await apiClient.get<string>(`/settings/${filename}`);
    return handleResponse(response);
  } catch (err) {
    handleError(err, 'Ошибка при получении списка файлов настроек');
  }
};

export const createSettingsFile = async (data: any): Promise<string | undefined> => {
  try {
    const response = await apiClient.post<string>(`/settings/create`, { data });
    return handleResponse(response, 'Настройки применены');
  } catch (err) {
    handleError(err, 'Ошибка при создании списка файлов настроек');
  }
};

export const goTest = async (testName: string): Promise<any> => {
  try {
    const response = await apiClient.post('/settings/test', { data: testName });
    console.log('goTest', response);
    if (response.status === 200) {
      return handleResponse(response);
    }
  } catch (err) {
    handleError(err, 'Ошибка при выполнении теста');
    return undefined;
  }
};

export const printBox = async (boxNumber: number, countInBox: number): Promise<void> => {
  try {
    const response = await apiClient.post('/printer/print-box', { boxNumber, countInBox });
    console.log('Print box successfully:', response);
  } catch (err) {
    handleError(err, 'Ошибка при печати коробки');
  }
};

export const printNextBox = async (): Promise<void> => {
  try {
    const response = await apiClient.post('/printer/print-next-box');
    console.log('Print next box successfully:', response);
  } catch (err) {
    handleError(err, 'Ошибка при печати новой коробки');
  }
};

export const printPallet = async (palletNumber: number, countInPallet: number): Promise<void> => {
  try {
    const response = await apiClient.post('/printer/print-pallet', { palletNumber, countInPallet });
    console.log('Print pallet successfully:', response);
  } catch (err) {
    handleError(err, 'Ошибка при печати паллеты');
  }
};

export const checkCameraConnection = async (): Promise<void> => {
  try {
    console.log('camera--------------1:');
    const response = await apiClient.get('/camera/status');
    console.log('camera--------------:', response);
  } catch (err) {
    handleError(err, 'Ошибка при печати паллеты');
  }
};

export const getPrinterStatus = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/printer/status');
    console.log('getPrinterStatus_______', response);
  } catch (err) {
    handleError(err, 'Ошибка при получении статуса принтера');
  }
};

