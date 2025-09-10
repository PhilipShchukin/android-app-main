import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import "./input.css";

interface IFileUploadForm {
  i: number;
  label: string;
  onChange: (i: number, value: string) => void;
  name: string;
  placeholder?: string;
  tooltipText?: string;
  isError?: boolean;
  onBlur: (inputName: string, value: string) => void;
  value?: string;
}

const FileUploadForm: React.FC<IFileUploadForm> = ({
  i,
  label,
  name,
  tooltipText,
  onChange,
  isError,
  onBlur,
  value,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
  const [isFileNameError, setIsFileNameError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  console.log("FileUploadForm >>>>>>>>>>>>>>>>>", fileName);

  useEffect(() => {
    if (typeof value === "string") {
      setFileName(value);
    }
  }, [value]);

  useEffect(() => {
    setIsFileNameError(isFileSelected && fileName === "");
  }, [isFileSelected, fileName]);

  useEffect(() => {
    if (isFileNameError) {
      onBlur(/* `${name}fileInput` */ name, fileName);
    } else {
      // if (onBlur) onBlur(/* `${name}fileInput` */ name, fileName);
    }
  }, [isFileNameError]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const n = file.name.replace(/\.[^/.]+$/, ""); // Убирает расширение
      setFileName(n);
      onChange(i, n);
      setIsFileSelected(false); // Установить статус выбора файла
      if (onBlur) onBlur(/* `${name}fileInput` */ name, n);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Очистить значение поля после выбора файла
      }
    } else {
      //  setIsFileSelected(false); // Если файл не выбран (кнопка "Отмена" нажата)
    }
  };

  const handleFileNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const n = event.target.value;
    setFileName(n);
    onChange(i, n);
    onBlur(/* `${name}fileInput` */ name, n);
  };

  return (
    <div className="input-file-upload">
      <label htmlFor={`${name}fileNameInput`}>
        {label}
        <span className="tooltip-icon" data-tooltip={tooltipText}>
          i
        </span>
      </label>
      <div className="input-file-upload-content">
        <input
          className={
            isError || isFileNameError ? "input-field-error" : "input-field"
          }
          type="text"
          id={`${name}fileNameInput`}
          value={fileName}
          name={name}
          onChange={handleFileNameChange}
          onBlur={() => onBlur(name, fileName)}
        />
        <label htmlFor={`${name}fileInput`} className="custom-file-upload">
          Выбрать этикетку
        </label>
        <input
          style={{ display: "none" }}
          type="file"
          name={name}
          id={`${name}fileInput`}
          ref={fileInputRef}
          onChange={handleFileChange}
          onClick={() => setIsFileSelected(true)}
          accept=".nlbl, .txt"
        />
      </div>
    </div>
  );
};

export default FileUploadForm;
