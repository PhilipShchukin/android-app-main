import { useDispatch } from "react-redux";
import { apiClient, handleResponse, handleError } from "../API/apiClient";
import { deleteNJsonFile } from "../store/nomenclatureJsonSlice";
import {
  saveOldSortingFile,
  saveOldSortingFiles,
  saveOldBoxes,
  saveOldBoxesCount,
  saveOldPallets,
  saveOldPalletCount,
} from "../store/OldSortingSlice";
import { IBoxRes } from "../store/types";

const useOldSortingDispatch = () => {
  const dispatch = useDispatch();

  const getRecordsFileContent = async (
    filename: string
  ): Promise<string | undefined> => {
    try {
      const response = await apiClient.get<string>(`/old-sorting/${filename}`);
      const data = handleResponse(response);
      if (data) {
        dispatch(saveOldSortingFile({ data: JSON.parse(data), filename }));
      }
      return data;
    } catch (err) {
      handleError(err, "Ошибка при получении файла номенклатуры");
      return undefined;
    }
  };

  const deleteRecordsFile = async (
    filename: string
  ): Promise<string | undefined> => {
    try {
      const response = await apiClient.delete<string>(
        `/old-sorting/${filename}`
      );
      const data = handleResponse(response);
      dispatch(deleteNJsonFile(filename));
      return data;
    } catch (err) {
      handleError(err, "Ошибка при удалении файла");
      return undefined;
    }
  };

  const getRecordsFiles = async () => {
    try {
      const response = await apiClient.get<any[]>(`/old-sorting`);
      const data = handleResponse(response);
      if (data && data.length) {
        dispatch(saveOldSortingFiles(data));
      }
    } catch (err) {
      handleError(err, "Ошибка при получении списка файлов");
    }
  };

  // const createRecordsFile = async (rootName: string, data: any): Promise<string[] | undefined> => {
  //   try {
  //     const response = await apiClient.post<string[]>(`/old-sorting/create`, {
  //       rootName, data
  //     });
  //     return handleResponse(response);
  //   } catch (err) {
  //     handleError(err, 'Ошибка при создании файла номенклатуры');
  //     return undefined;
  //   }
  // };

  const startLabelPrint = async (fileName: string): Promise<any> => {
    try {
      const response = await apiClient.post<string[]>(
        `/old-sorting/start-label`,
        { fileName }
      );
      return handleResponse(response);
    } catch (err) {
      handleError(err, "Ошибка при старте раздела печати этикеток");
      return undefined;
    }
  };

  const stopLabelPrint = async (): Promise<any> => {
    try {
      const response = await apiClient.post<string[]>(
        `/old-sorting/stop-label`
      );
      return handleResponse(response);
    } catch (err) {
      handleError(err, "Ошибка при остановке раздела печати этикеток");
      return undefined;
    }
  };

  const getAllBoxes = async (
    page: number,
    limit: number
  ): Promise<{ data: IBoxRes[]; total: number } | undefined> => {
    try {
      const response = await apiClient.get<{ data: IBoxRes[]; total: number }>(
        `/old-sorting/allBoxes?page=${page}&limit=${limit}`
      );
      const data = handleResponse(response);
      // console.log('______________getAllBoxes__________________', data);
      if (data) {
        if (data.data && data.data.length) {
          dispatch(saveOldBoxes(data.data));
        }
        if (data.total) {
          dispatch(saveOldBoxesCount(data.total));
        }
      } else if (data && data.message) {
        handleError("", data.message);
      } else if (!Object.keys(data).length) {
        handleError("", "В базе данных пока нет записей");
      }
      return data;
    } catch (err) {
      handleError(err, "История, ошибка при получении списка всех коробов");
      return undefined;
    }
  };

  const getAllPalets = async (
    page: number,
    limit: number
  ): Promise<{ data: IBoxRes[]; total: number } | undefined> => {
    try {
      const response = await apiClient.get<{ data: IBoxRes[]; total: number }>(
        `/old-sorting/allPallets?page=${page}&limit=${limit}`
      );
      const data = handleResponse(response);
      if (data) {
        if (data.data && data.data.length) {
          dispatch(saveOldPallets(data.data));
        }
        if (data.total) {
          dispatch(saveOldPalletCount(+data.total));
        }
      } else if (data && data.message) {
        handleError("", data.message);
      } else if (!Object.keys(data).length) {
        handleError("", "В базе данных пока нет записей");
      }
      return data;
    } catch (err) {
      handleError(err, "История, ошибка при получении списка всех паллет");
      return undefined; // Возвращаем undefined в случае ошибки
    }
  };

  return {
    getRecordsFileContent,
    deleteRecordsFile,
    getRecordsFiles,
    // createRecordsFile,
    startLabelPrint,
    stopLabelPrint,
    getAllBoxes,
    getAllPalets,
  };
};

export default useOldSortingDispatch;
