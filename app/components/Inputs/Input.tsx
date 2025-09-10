// InputWithTooltip.tsx
import React, { ChangeEvent } from "react";
import "./input.css";

interface InputWithTooltipProps {
  i: number;
  label: string;
  onChange: (i: number, value: any) => void;
  name?: string;
  placeholder?: string;
  tooltipText?: string;
  isError?: boolean;
  onBlur?: (e: any) => void;
  required?: boolean;
  value?: string;
}

const InputWithTooltip: React.FC<InputWithTooltipProps> = ({
  i,
  label,
  onChange,
  name,
  placeholder,
  tooltipText,
  isError,
  onBlur,
  required = false,
  value = "",
}) => {
  return (
    <div className="input-with-tooltip">
      <label>
        {label}
        {/* <span className="tooltip-icon" data-tooltip={tooltipText}>
          i
        </span> */}
      </label>
      <input
        value={value}
        required={required}
        name={name}
        type="text"
        placeholder={placeholder}
        className={isError ? "input-field-error" : "input-field"}
        onChange={(e) => onChange(i, e.target.value)}
        onBlur={onBlur}
      />
    </div>
  );
};

export default InputWithTooltip;
