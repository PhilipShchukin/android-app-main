import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import {
  apiClient,
  handleError,
  handleResponse,
  notifySuccess,
} from "../API/apiClient";
import { UsersRoles } from "../API/types/types";
import { IUser } from "../components/Auth/types";
import { localStorageNames } from "../helpers/global-types";

const useAuthDispatch = () => {
  const dispatch = useDispatch();

  const createUser = async (
    username: string,
    password: string,
    role: UsersRoles,
    isAdminRegister?: boolean
  ) => {
    try {
      const response = await apiClient.post<string>("/users/create", {
        username,
        password,
        role,
      });
      const data = handleResponse(
        response,
        !isAdminRegister
          ? "Вы зарегистрировались"
          : "Вы зарегистрировали нового пользователя"
      );
      if (data && !isAdminRegister) {
        dispatch(setUser(data));
        localStorage.setItem(localStorageNames.User, JSON.stringify(data));
      }
      return data;
    } catch (err: any) {
      handleError(
        err,
        err.response?.data.message || "Ошибка при регистрации пользователя"
      );
      return undefined;
    }
  };

  const authUser = async (username: string, password: string) => {
    try {
      const response = await apiClient.post<string>("/users/auth", {
        username,
        password,
      });
      const data = handleResponse(response, "Вы авторизовались");
      if (data) {
        dispatch(setUser(data));
        localStorage.setItem(localStorageNames.User, JSON.stringify(data));
      }
      return data;
    } catch (err: any) {
      handleError(
        err,
        err.response?.data.message || "Ошибка при авторизации пользователя"
      );
      return err.response?.data.message;
    }
  };

  const checkLocalStorage = () => {
    const user = localStorage.getItem(localStorageNames.User);
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  };

  // ----------admin------------------
  const getAllUsers = async () => {
    try {
      const response = await apiClient.get<{ data: IUser[]; total: number }>(
        "/users"
      );
      const data = handleResponse(
        response,
        "Получен список всех пользователей"
      );
      if (data) {
        console.log("getAllUsers____", data);
      }
      return data;
    } catch (err: any) {
      handleError(
        err,
        err.response?.data.message ||
          "Ошибка при получении списка всех пользователей"
      );
      return err.response?.data.message;
    }
  };

  const updateUser = async (
    id: number,
    username?: string,
    password?: string,
    role?: UsersRoles
  ) => {
    try {
      const response = await apiClient.put<string>(`/users/${id}`, {
        username,
        password,
        role,
      });
      const data = handleResponse(
        response,
        `Пользователь ${username} обновлен`
      );
      return data;
    } catch (err: any) {
      handleError(
        err,
        err.response?.data.message || "Ошибка при обновлении пользователя"
      );
      return undefined;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await apiClient.delete(`/users/${id}`);
      notifySuccess(`Пользователь с ID ${id} удален`);
    } catch (err: any) {
      handleError(
        err,
        err.response?.data.message || "Ошибка при удалении пользователя"
      );
      return undefined;
    }
  };

  return {
    createUser,
    authUser,
    checkLocalStorage,
    getAllUsers,
    updateUser,
    deleteUser,
  };
};

export default useAuthDispatch;
