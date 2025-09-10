// Register.tsx
import React, { useEffect, useState } from "react";
import "./auth.css";
import { changeAuthPage } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { AuthPages } from "../../store/types";
import useAuthDispatch from "@/app/hooks/useAuthDispatch";

const Autentificaation: React.FC = () => {
  const dispatch = useDispatch();
  const { authUser, checkLocalStorage } = useAuthDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkLocalStorage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authUser(username, password);
  };

  const changePageHandler = () => {
    dispatch(changeAuthPage(AuthPages.Register));
  };

  return (
    <div className="auth">
      <div className="form-container">
        <h2>Авторизация</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="auth-input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Имя"
            required
          />
          <input
            type="password"
            className="auth-input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
          <button type="submit" className="submit-button">
            Войти
          </button>
        </form>
      </div>
      <div className="auth__link">
        <p>Нет регистрации?</p>
        <button onClick={changePageHandler}>Зарегистрироваться</button>
      </div>
    </div>
  );
};

export default Autentificaation;
