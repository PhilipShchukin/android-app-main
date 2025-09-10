import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./input.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru"; // Импортируйте русскую локаль

// Регистрация русской локали
registerLocale("ru", ru);
setDefaultLocale("ru");

interface DateInputProps {
  label: string;
  value: Date | null;
  name: string;
  onChange: (date: Date | null) => void;
  [key: string]: any; // Для других параметров
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  name,
  onChange,
  ...props
}) => {
  const handleChange = (date: Date | null) => {
    onChange(date);
  };

  const addYears = (years: number) => {
    if (value) {
      const newDate = new Date(value);
      newDate.setFullYear(newDate.getFullYear() + years);
      onChange(newDate);
    }
  };

  return (
    <div className={`date-input ${props.isError ? "error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <div className="date-picker-container">
        <button type="button" onClick={() => addYears(1)}>
          +1 год
        </button>
        <button type="button" onClick={() => addYears(-1)}>
          -1 год
        </button>
        <DatePicker
          selected={value}
          onChange={handleChange}
          name={name}
          id={name}
          dateFormat="dd.MM.yyyy"
          locale="ru" // Установите локаль на русский
          {...props}
          autoComplete="off"
          popperPlacement="top" // Разместите всплывающее окно сверху
        />
      </div>
    </div>
  );
};

export default DateInput;
