'use client';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
//http://192.168.100.25:3001

// const baseURL = process.env.REACT_APP_SERVER_URL
// const baseURL = 'http://192.168.100.31:3001';
const baseURL = 'http://172.16.16.1:3001';
console.log('baseURL______________', baseURL);

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notifyError = (message: string) => {
  toast.error(`Ошибка! ${message}`, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
  });
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
  });
};

const handleResponse = <T>(response: AxiosResponse<T>, message?: string): any => {
  try {
    console.log('Response received:', response);
    if (response && response.data) {
      if (message) {
        notifySuccess(message);
      }
      return response.data;
    }
    throw new Error('Invalid response structure');
  } catch (err) {
    console.log(err);
  }
};

const handleError = (error: any, errorMessage?: string): undefined => {
  if (errorMessage) notifyError(errorMessage);
  return undefined;
};

export { apiClient, handleResponse, handleError };
