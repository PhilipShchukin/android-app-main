import { useDispatch } from "react-redux";
import { apiClient, handleError, handleResponse } from "../API/apiClient";
import { changeCurrentGtin } from "../store/DBWorkSlice";
import {
  changeIsUnfinishedTask,
  changeMonitoringStatus,
  changePauseStatus,
  saveTaskName,
} from "../store/monitoringSlice";
import { IIsUnfinishedTask, IMonitoringStatus } from "../API/types/types";

const useMonitoringDispatch = () => {
  const dispatch = useDispatch();

  const startMonitoring = async (taskName: string, gtin: string) => {
    try {
      const response = await apiClient.post(`/monitoring/start`, {
        taskName,
        gtin,
      });
      if (response.status === 201) {
        dispatch(changeCurrentGtin(gtin));
      }
    } catch (err) {
      handleError(err, "Ошибка при запуске мониторинга");
    }
  };

  const startOldMonitoring = async (taskName: string, gtin: string) => {
    try {
      const response = await apiClient.post(`/monitoring/start-old-sorting`, {
        taskName,
        gtin,
      });
      if (response.status === 201) {
        dispatch(changeCurrentGtin(gtin));
      }
    } catch (err) {
      handleError(err, "Ошибка при запуске мониторинга");
    }
  };

  const stopMonitoring = async () => {
    try {
      const res = await apiClient.post(`/monitoring/stop`);
      console.log("stopMonitoring+++++", res.data);
    } catch (err) {
      handleError(err, "Ошибка остановке мониторинга");
    }
  };

  const pauseMonitoring = async () => {
    try {
      const res = await apiClient.post(`/monitoring/pause`);
      console.log("pauseMonitoring+++++", res.data);
      dispatch(changePauseStatus(true));
    } catch (err) {
      handleError(err, "Ошибка паузе мониторинга");
    }
  };

  const continuedMonitoring = async () => {
    try {
      const res = await apiClient.post(`/monitoring/continued`);
      console.log("continuedMonitoring+++++", res.data);
      dispatch(changePauseStatus(false));
    } catch (err) {
      handleError(err, "Ошибка продолжении мониторинга");
    }
  };

  const getMonitoringStatus = async (): Promise<
    IMonitoringStatus | undefined
  > => {
    try {
      const response = await apiClient.get<IMonitoringStatus>(
        `/monitoring/status`
      );
      console.log("getMonitoringStatus___", response);
      const data = handleResponse(response);
      if (data) {
        dispatch(changeMonitoringStatus(data.status));
        dispatch(saveTaskName(data.taskName));
      }
      return response.data;
    } catch (err) {
      handleError(err, "Ошибка при получении статуса мониторинга");
    }
  };

  const getIsUnfinishedTask = async (): Promise<void> => {
    try {
      const response = await apiClient.get<IIsUnfinishedTask>(
        `/monitoring/is-unfinished-task`
      );
      console.log("getIsUnfinishedTask -----------", response);
      const data = handleResponse(response) as IIsUnfinishedTask;
      if (data) {
        const { isUnfinishedTask, taskFileName } = data;
        console.log("getIsUnfinishedTask -----------^^^^^^^", data);
        dispatch(changeIsUnfinishedTask(isUnfinishedTask));
        dispatch(saveTaskName(taskFileName));
      }
    } catch (err) {
      handleError(err, "Ошибка при получении статуса не завершенных заданий");
    }
  };

  return {
    startMonitoring,
    startOldMonitoring,
    stopMonitoring,
    getMonitoringStatus,
    pauseMonitoring,
    continuedMonitoring,
    getIsUnfinishedTask,
  };
};

export default useMonitoringDispatch;
