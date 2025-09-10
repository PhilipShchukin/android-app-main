import { useDispatch } from "react-redux";
import { apiClient, handleResponse, handleError } from "../API/apiClient";
import {
  saveTaskJsonFile,
  saveTaskJsonFiles,
  deleteTaskJsonFile,
} from "../store/taskJsonSlice";

const useTaskDispatch = () => {
  const dispatch = useDispatch();

  const getTaskFileContent = async (
    filename: string
  ): Promise<string | undefined> => {
    try {
      const response = await apiClient.get<string>(`/tasks/${filename}`);
      const data = handleResponse(response);
      if (data) {
        dispatch(saveTaskJsonFile({ data: JSON.parse(data), filename }));
      }
      return data;
    } catch (err) {
      handleError(err, "Ошибка при получении списка файлов задания");
      return undefined; // Возвращаем undefined в случае ошибки
    }
  };

  const getTaskFiles = async (): Promise<string[] | undefined> => {
    try {
      const response = await apiClient.get<string>(`/tasks`);
      const data = handleResponse(response);
      if (data && data.length) {
        dispatch(saveTaskJsonFiles(data));
      }
      return data;
    } catch (err) {
      handleError(err, "Ошибка при получении списка файлов заданий");
      return undefined; // Возвращаем undefined в случае ошибки
    }
  };

  const createTaskFile = async (
    rootName: string,
    data: any
  ): Promise<string | undefined> => {
    try {
      const response = await apiClient.post<string>("/tasks/create", {
        rootName,
        data,
      });
      // return handleResponse(response);
    } catch (err) {
      handleError(err, "Ошибка при создании файла задания");
      return undefined; // Возвращаем undefined в случае ошибки
    }
  };

  const deleteTaskFile = async (
    filename: string
  ): Promise<string | undefined> => {
    try {
      const response = await apiClient.delete<string>(`/tasks/${filename}`);
      const data = handleResponse(response);
      dispatch(deleteTaskJsonFile(filename));
      return data;
    } catch (err) {
      handleError(err, "Ошибка при удалении файла");
      return undefined;
    }
  };

  return { getTaskFileContent, getTaskFiles, createTaskFile, deleteTaskFile };
};

export default useTaskDispatch;
