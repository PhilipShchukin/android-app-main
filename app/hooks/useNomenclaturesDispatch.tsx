import { useDispatch } from "react-redux";
import {
  deleteNJsonFile,
  saveNJsonFile,
  saveNJsonFiles,
} from "../store/nomenclatureJsonSlice";
import { apiClient, handleError, handleResponse } from "../API/apiClient";

const useNomenclaturesDispatch = () => {
  const dispatch = useDispatch();

  const getNomFileContent = async (
    filename: string
  ): Promise<string | undefined> => {
    try {
      const response = await apiClient.get<string>(
        `/nomenclatures/${filename}`
      );
      const data = handleResponse(response);
      if (data) {
        dispatch(saveNJsonFile({ data: JSON.parse(data), filename }));
      }
      return data;
    } catch (err) {
      handleError(err, "Ошибка при получении файла номенклатуры");
      return undefined;
    }
  };

  const deleteNomFile = async (
    filename: string
  ): Promise<string | undefined> => {
    try {
      const response = await apiClient.delete<string>(
        `/nomenclatures/${filename}`
      );
      const data = handleResponse(response);
      dispatch(deleteNJsonFile(filename));
      return data;
    } catch (err) {
      handleError(err, "Ошибка при удалении файла");
      return undefined;
    }
  };

  const getNomFiles = async (): Promise<string[] | undefined> => {
    try {
      const response = await apiClient.get<string[]>(`/nomenclatures`);
      const data = handleResponse(response);
      if (data) {
        dispatch(saveNJsonFiles(data));
      }
      return data;
    } catch (err) {
      handleError(err, "Ошибка при получении списка файлов");
      return undefined;
    }
  };

  const createNomFile = async (
    rootName: string,
    data: any
  ): Promise<string[] | undefined> => {
    try {
      const response = await apiClient.post<string[]>(`/nomenclatures/create`, {
        rootName,
        data,
      });
      return handleResponse(response);
    } catch (err) {
      handleError(err, "Ошибка при создании файла номенклатуры");
      return undefined;
    }
  };

  return { getNomFileContent, deleteNomFile, getNomFiles, createNomFile };
};

export default useNomenclaturesDispatch;
