import React, { ChangeEvent } from "react";
import "./input.css";

interface ISettingInputProps {
  i: number;
  label: string;
  onChange: (name: string, value: any) => void;
  name?: string;
  placeholder?: string;
  tooltipText?: string;
  isError?: boolean;
  onBlur?: (e: any) => void;
  required?: boolean;
  value?: string;
  max?: number;
  min?: number;
}

const SettingInput: React.FC<ISettingInputProps> = ({
  i,
  label,
  onChange,
  name,
  placeholder,
  tooltipText,
  isError = false,
  onBlur,
  required = false,
  value = "",
  max = 32767,
  min = 0
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    const name = e.target.name
    if (newValue >= min && newValue <= max) {
      onChange(name, newValue);
    }
  };

  return (
    <div className="input-setting">
      <label>
        {label}        
      </label>
      <input
        value={value}
        required={required}
        name={name}
        type="number"
        placeholder={placeholder}
        className={isError ? "input-field-error" : "input-setting-field"}
        onChange={handleChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default SettingInput;
