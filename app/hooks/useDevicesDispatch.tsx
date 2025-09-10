import { useDispatch } from "react-redux";
import { apiClient, handleError, handleResponse } from "../API/apiClient";

const useDevicesDispatch = () => {
  const dispatch = useDispatch();

  const updatePrinterConfig = async (
    name: string,
    type: string,
    host: string,
    port: number,
    enabled?: boolean
  ): Promise<void> => {
    try {
      const response = await apiClient.post("/printer/update-config", {
        name,
        type,
        host,
        port,
        enabled,
      });
      console.log("Config Printer updated successfully:", response);
    } catch (err) {
      handleError(err, "Ошибка при отправке конфигурации принтера");
    }
  };

  const updatePLCConfig = async (
    name: string,
    type: string,
    host: string,
    port: number
  ): Promise<void> => {
    try {
      const response = await apiClient.post("/modbus/update-config", {
        name,
        type,
        host,
        port,
      });
      console.log("Config PLC updated successfully:", response);
    } catch (err) {
      handleError(err, "Ошибка при отправке конфигурации ПЛК");
    }
  };

  const updateCameraConfig = async (
    name: string,
    type: string,
    host: string,
    port: number
  ): Promise<void> => {
    try {
      const response = await apiClient.post("/camera/update-config", {
        name,
        type,
        host,
        port,
      });
      console.log("Config camera updated successfully:", response);
    } catch (err) {
      handleError(err, "Ошибка при отправке конфигурации камеры");
    }
  };

  const getPLCConfig = async (label: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/modbus/${label}`);
      console.log("getConfig:", response);
      return handleResponse(response);
    } catch (err) {
      handleError(err, "Ошибка при получении конфигураций");
    }
  };

  const getCameraConfig = async (label: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/camera/${label}`);
      console.log("getConfig:", response);
      return handleResponse(response);
    } catch (err) {
      handleError(err, "Ошибка при получении конфигураций");
    }
  };

  const getPrinterConfig = async (label: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/printer/${label}`);
      console.log("getConfig:", response);
      return handleResponse(response);
    } catch (err) {
      handleError(err, "Ошибка при получении конфигураций");
    }
  };

  return {
    updatePrinterConfig,
    updatePLCConfig,
    getPrinterConfig,
    getCameraConfig,
    getPLCConfig,
    updateCameraConfig,
  };
};

export default useDevicesDispatch;
