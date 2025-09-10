import { useDispatch } from 'react-redux';

import { IBoxRes, IReportRes, ISearchRes } from '../store/types';
import {
  saveBoxRequest,
  saveCodeRequest,
  saveAllBoxesRequest,
  saveAllPalletsRequest,
  changeCountInBox,
  saveTotalBoxesCount,
  saveTotalPalletCount,
  changeFrom,
  changeBoxNumber,
} from '../store/DBWorkSlice';
import { notifySuccess, apiClient, handleError, handleResponse } from '../API/apiClient';
import { IDeleteCodesData } from '../API/types/types';
import { AxiosError } from 'axios';
import { ContainerData } from '../components/shared/Search/report/Report';

const useSearchDispatch = () => {
  const dispatch = useDispatch();

  const saveCode = async (code: string) => {
    try {
      await apiClient.post('/code/save', { code });
    } catch (err) {
      handleError(err, 'Ошибка при сохранении кода!');
    }
  };

  const handSaveCode = async (code: string) => {
    try {
      const res = await apiClient.post('/code/hand-save', { code });
      if (res) {
        return res.data;
      }
    } catch (err) {
      handleError(err, 'Ошибка при сохранении кода в ручном режиме!');
    }
  };

  const getSearchCode = async (searchQuery: string): Promise<ISearchRes | undefined> => {
    try {
      const response = await apiClient.post<string>('/code/search-android', {
        query: searchQuery,
      });
      const data = handleResponse(response);
      console.log(data, 'getSearchCode');
      if (data) {
        if (data.message) {
          handleError(data.message, data.message);
        }
        dispatch(saveCodeRequest(data.code));
        dispatch(changeCountInBox(data.countInBox));
        if (data.code) {
          dispatch(changeBoxNumber(+data.code.box_number));
          dispatch(changeFrom(data.from));
        }
      } else {
        dispatch(saveCodeRequest(null));
        dispatch(changeCountInBox(null));
      }
      return data;
    } catch (err) {
      handleError(err, `${err}`);
      return undefined;
    }
  };
  const getCodeSearchGlobal = async (searchQuery: string): Promise<ISearchRes | undefined> => {
    try {
      const response = await apiClient.post<string>('/code/search-android-global', {
        query: searchQuery,
      });
      const data = handleResponse(response);
      console.log(data, 'getSearchCode');
      if (data) {
        if (data.message) {
          handleError(data.message, data.message);
        }
        dispatch(saveCodeRequest(data.code));
        dispatch(changeCountInBox(data.countInBox));
        if (data.code) {
          dispatch(changeBoxNumber(+data.code.box_number));
          dispatch(changeFrom(data.from));
        }
      } else {
        dispatch(saveCodeRequest(null));
        dispatch(changeCountInBox(null));
      }
      return data;
    } catch (err) {
      handleError(err, `${err}`);
      return undefined;
    }
  };

  const getCodeSearchGlobalBox = async (searchQuery: string): Promise<IReportRes | undefined> => {
    try {
      const response = await apiClient.post<string>('/code/search-android-global-box', {
        query: searchQuery,
      });
      const data = handleResponse(response);

      return data;
    } catch (err) {
      handleError(err, `${err}`);
      return undefined;
    }
  };
  const getCodeSearchGlobalPallet = async (
    searchQuery: string,
  ): Promise<IReportRes | undefined> => {
    try {
      const response = await apiClient.post<string>('/code/search-android-global-pallet', {
        query: searchQuery,
      });
      const data = handleResponse(response);
      return data;
    } catch (err) {
      handleError(err, `${err}`);
      return undefined;
    }
  };

  const getReportBoxAndPallet = async (data: ContainerData): Promise<any> => {
    try {
      const response = await apiClient.post<string>('/code/get-unique-codes', {
        ...data,
      });
      //@ts-ignore
      if (response.data.status === 200) {
        const { length, status } = handleResponse(response);

        return length;
      } else {
        handleError('', 'Отчет не создан');
      }
    } catch (err) {
      handleError(err, `${err}`);
      return undefined;
    }
  };

  const getSearchCodeForBox = async (searchQuery: string): Promise<any | undefined> => {
    try {
      const response = await apiClient.get<string>(
        `/code/searchWithPageNumber?query=${searchQuery}`,
      );
      const data = handleResponse(response);
      return data;
    } catch (err) {
      handleError(err, 'Ошибка при получении данных по коду!');
      return undefined;
    }
  };

  const getSearchByBoxNumber = async (box_number: number): Promise<ISearchRes[] | undefined> => {
    try {
      const response = await apiClient.get<ISearchRes[]>(
        `/code/searchByBoxNumber?boxNumber=${box_number}`,
      );
      const data = handleResponse(response);
      if (data && data.length) {
        dispatch(saveBoxRequest(data));
      }
      return data;
    } catch (err) {
      handleError(err, 'Ошибка при получении кодов по номеру коробки!');
      return undefined; // Возвращаем undefined в случае ошибки
    }
  };

  const getAllBoxes = async (
    page: number,
    limit: number,
  ): Promise<{ data: IBoxRes[]; total: number } | undefined> => {
    try {
      const response = await apiClient.get<{ data: IBoxRes[]; total: number }>(
        `/code/allBoxes?page=${page}&limit=${limit}`,
      );

      const data = handleResponse(response);

      if (data) {
        if (data.data && data.data.length) {
          dispatch(saveAllBoxesRequest(data.data));
        } else {
          dispatch(saveAllBoxesRequest([]));
        }
        if (data.total) {
          dispatch(saveTotalBoxesCount(data.total));
        }
      } else if (data && data.message) {
        handleError('', data.message);
      } else if (!Object.keys(data).length) {
        handleError('', 'В базе данных пока нет записей');
      }
      return data;
    } catch (err) {
      console.log(err, 'errrrr');
      handleError(
        err,
        `Ошибка при получении списка всех коробов ${(err as AxiosError).config?.baseURL}`,
      );
      return undefined; // Возвращаем undefined в случае ошибки
    }
  };

  const getCurrentBoxNumber = async (): Promise<any> => {
    try {
      const response = await apiClient.get(`/code/current-box-number`);
      console.log('🟢 Ответ сервера:', response);

      const data = handleResponse(response);
      console.log('🟢 Обработанные данные:', data);

      return data;
    } catch (err) {
      console.log(err, 'errrrr');
      handleError(err, 'Ошибка при получении текущей коробки!');
      return undefined; // Возвращаем undefined в случае ошибки
    }
  };

  const getAllPalets = async (
    page: number,
    limit: number,
  ): Promise<{ data: IBoxRes[]; total: number } | undefined> => {
    try {
      const response = await apiClient.get<{ data: IBoxRes[]; total: number }>(
        `/code/allPallets?page=${page}&limit=${limit}`,
      );
      const data = handleResponse(response);
      if (data) {
        if (data.data && data.data.length) {
          dispatch(saveAllPalletsRequest(data.data));
        } else {
          dispatch(saveAllPalletsRequest([]));
        }
        if (data.total) {
          dispatch(saveTotalPalletCount(+data.total));
        }
      } else if (data && data.message) {
        handleError('', data.message);
      } else if (!Object.keys(data).length) {
        handleError('', 'В базе данных пока нет записей');
      }
      return data;
    } catch (err) {
      handleError(err, 'Ошибка при получении списка всех паллет');
      return undefined; // Возвращаем undefined в случае ошибки
    }
  };

  const getAllLogs = async (
    page: number,
    limit: number,
  ): Promise<{ data: any[]; total: number } | undefined> => {
    try {
      const response = await apiClient.get<{ data: any[]; total: number }>(
        `/code/logs?page=${page}&limit=${limit}`,
      );
      const data = handleResponse(response);
      if (data && data.length) {
        // console.log('getAllLogs=======', data);
        // dispatch(saveAllPalletsRequest(data.data));
      } else if (data && data.message) {
        handleError('', data.message);
      } else if (!Object.keys(data).length) {
        handleError('', 'В логах пока нет записей');
      }
      return data;
    } catch (err) {
      handleError(err, 'Ошибка при получении списка всех логов');
      return undefined;
    }
  };

  const getCurrentData = async (): Promise<void> => {
    try {
      await apiClient.get<{ data: any[]; total: number }>('/code/currentData');
    } catch (err) {
      handleError(err);
    }
  };

  const getBoxLimit = async () => {
    try {
      const res = await apiClient.get('/code/box-limit');
      const data = handleResponse(res);
      return data;
    } catch (err) {
      handleError(err);
    }
  };

  const getWorkStatus = async () => {
    try {
      const res = await apiClient.get('/monitoring/work-status');
      const data = handleResponse(res);
      console.log(data);
      return data;
    } catch (err) {
      handleError(err);
    }
  };

  const moveBoxToPalleta = async (boxNumber: number, newPalletNumber: number): Promise<any> => {
    try {
      const response = await apiClient.post<any>('/code/move-box-to-pallet', {
        boxNumber,
        newPalletNumber,
      });
      const data = handleResponse(response);
      return data;
    } catch (err) {
      handleError(err, `Ошибка при перемещении коробки ${boxNumber} в паллету ${newPalletNumber}`);
    }
  };

  // const deleteCode = async (code: string): Promise<void> => {
  //   try {
  //     await apiClient.delete('/code/deleteCode', { data: { code } });
  //     console.log(`Код ${code} успешно удален`);
  //   } catch (err) {
  //     handleError(err, 'Ошибка при удалении кода');
  //   }
  // };

  const deleteTables = async (): Promise<void> => {
    try {
      await apiClient.delete('/code/delete-tables');
      notifySuccess(`Все таблицы успешно удалены`);
      console.log(`Все таблицы успешно удалены`);
    } catch (err) {
      handleError(err, 'Ошибка при удалении таблиц');
    }
  };

  const deleteCodes = async (codes: IDeleteCodesData[]): Promise<void> => {
    try {
      await apiClient.delete('/code/deleteCodes', { data: { codes } });
      console.log(`Коды ${codes.join(', ')} успешно удалены`);
    } catch (err) {
      handleError(err, 'Ошибка при удалении кодов');
    }
  };

  const addCodeToBox = async (
    code: string,
    boxNumber: number,
    palletNumber: number,
  ): Promise<any> => {
    try {
      const response = await apiClient.post('/code/addCodeToBox', {
        code,
        boxNumber,
        palletNumber,
      });
      console.log(`Код ${code} успешно добавлен в короб ${boxNumber} в паллету ${palletNumber}`);
      const data = handleResponse(response);
      return data;
    } catch (err) {
      handleError(err, 'Ошибка при добавлении кода в короб');
    }
  };

  const deleteBox = async (boxNumber: number): Promise<void> => {
    try {
      await apiClient.delete('/code/deleteBox', { data: { boxNumber } });
      console.log(`Короб ${boxNumber} успешно удален`);
      notifySuccess(`Коробка${boxNumber} успешно удалена!`);
    } catch (err) {
      handleError(err, 'Ошибка при удалении короба');
    }
  };

  const removeBoxFromPallet = async (boxNumber: number): Promise<void> => {
    try {
      await apiClient.post('/code/removeBoxFromPallet', { boxNumber });
      console.log(`Короб ${boxNumber} успешно изъят из паллеты`);
    } catch (err) {
      handleError(err, 'Ошибка при изъятии короба из паллеты');
    }
  };

  const deletePallet = async (palletNumber: number): Promise<void> => {
    try {
      await apiClient.delete('/code/deletePallet', { data: { palletNumber } });
      console.log(`Паллета ${palletNumber} успешно удалена`);
    } catch (err) {
      handleError(err, 'Ошибка при удалении паллеты');
    }
  };

  return {
    saveCode,
    handSaveCode,
    getSearchCode,
    getCodeSearchGlobal,
    getSearchCodeForBox,
    getCodeSearchGlobalBox,
    getCodeSearchGlobalPallet,
    getReportBoxAndPallet,
    getSearchByBoxNumber,
    getAllBoxes,
    getCurrentBoxNumber,
    getBoxLimit,
    getWorkStatus,
    getAllPalets,
    getAllLogs,
    deleteTables,
    // deleteCode,
    deleteCodes,
    addCodeToBox,
    deleteBox,
    // removeBoxFromPallet,
    deletePallet,
    getCurrentData,
    moveBoxToPalleta,
  };
};

export default useSearchDispatch;
