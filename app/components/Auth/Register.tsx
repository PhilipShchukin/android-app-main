// Register.tsx
import React, { useState } from "react";
import "./auth.css";
import { changeAuthPage } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { AuthPages } from "../../store/types";
import useAuthDispatch from "@/app/hooks/useAuthDispatch";
import { UsersRoles } from "@/app/API/types/types";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const { createUser } = useAuthDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createUser(username, password, UsersRoles.Guest);
  };

  const changePageHandler = () => {
    dispatch(changeAuthPage(AuthPages.Auth));
  };

  return (
    <div className="auth">
      <div className="form-container">
        <h2>Регистрация</h2>
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
            Зарегистрироваться
          </button>
        </form>
      </div>
      <div className="auth__link">
        <p>Уже есть регистрация?</p>
        <button onClick={changePageHandler}>Авторизоваться</button>
      </div>
    </div>
  );
};

export default Register;
