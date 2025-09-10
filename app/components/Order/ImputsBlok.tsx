import React, { FocusEvent, useState } from "react";
import DateInput from "../Inputs/DateInput";
import InputWithTooltip from "../Inputs/Input";
import { validateInput } from "../Nomenclatures/validation";
import { NStatus, anyObject } from "../Nomenclatures/types";
import { formatDate } from "./helper";
import { validateDate } from "./validation";
import { ORDER } from "./sample";
import Modal from "../Modal/Modal";
import ErrorMessage from "../Modal/Messages/ErrorMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { IInputData } from "../../store/types";
import "./order.css";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../../API/apiClient";
import { checkFiles } from "../../API/1sApi";
import useTaskDispatch from "@/app/hooks/useTaskDispatch";

interface InputState {
  activeTask: IInputData[];
  setActiveTask: any;
  errors: anyObject;
  setErrors: any;
  setIsAddFile: any;
}

const InputsBlock: React.FC<InputState> = ({
  activeTask,
  setActiveTask,
  errors,
  setErrors,
  setIsAddFile,
}) => {
  const navigate = useNavigate();
  const { selectedFileName, selectedAllFileContent } = useSelector(
    (state: RootState) => state.nomenklanureJson
  );
  const { createTaskFile } = useTaskDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nStatus, setNStatus] = useState(NStatus.Error);
  const dis = !selectedFileName;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleDateInputChange = (index: number) => (date: Date | null) => {
    const updatedData = activeTask.map((item, i) => {
      if (i === index) {
        if (date) {
          return { ...item, value: formatDate(date) };
        } else {
          return { ...item, value: "" };
        }
      }
      return item;
    });
    setActiveTask(updatedData);
  };

  // const editTask = () => {
  //   if (selectedFileName) {
  //     const updatedFormData = activeTask.map((el) => {
  //       return {
  //         ...el,
  //         value: selectedFileContent[el.name] || "",
  //       };
  //     });
  //     isAllSuccess(updatedFormData);
  //     setActiveTask(updatedFormData);
  //   }
  // };

  // Обработка изменения инпута
  const handleChangeN = (index: number, newValue: string) => {
    const updatedData = activeTask.map((item, i) => {
      if (i === index) {
        const { name } = item;
        if (
          name === "pieces_per_package" ||
          name === "packaging_per_pallet" ||
          name === "startCorob" ||
          name === "startPallet" ||
          name === "productCount"
        ) {
          const numericValue = newValue.replace(/\D/g, "");
          return { ...item, value: numericValue };
        } else {
          return { ...item, value: newValue };
        }
      }
      return item;
    });
    // console.log('updatedData-----------', updatedData);
    setActiveTask(updatedData);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);

    validateInput(name, value, setErrors, errors);
  };

  const handleDateBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);

    validateDate(name, value, setErrors, errors);
  };

  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split(".").map(Number);
    return new Date(year, month - 1, day);
  };

  const isAllSuccess = (data?: any) => {
    const requiredKeys = ORDER.filter((item) => item.required) // Фильтруем по полю required
      .map((item) => item.name); // Получаем только имена ключей
    // Проверяем наличие всех обязательных ключей в activeTask
    const isAllRequired = () => {
      const newErrors: any = {};
      requiredKeys.forEach((key) => {
        const a = data
          ? data.filter((el: any) => el.name === key)[0].value
          : activeTask.filter((el) => el.name === key)[0].value;
        if (!a) {
          newErrors[key] = "err";
        } else {
          newErrors[key] = "";
        }
        console.log("a=========", a);
      });
      console.log("newErrors", newErrors);
      setErrors(newErrors);
      return newErrors;
    };
    const allRequiredKeysPresent = Object.values(isAllRequired()).every(
      (value) => !value
    );
    const isFormValid = Object.values(errors).every((error) => !error);

    return isFormValid && allRequiredKeysPresent;
  };

  const goToNomenklatures = () => {
    navigate("/nomenclatures");
  };

  const getTasks1S = async () => {
    await checkFiles();
  };

  const handleSubmit = async () => {
    if (isAllSuccess()) {
      const formData: anyObject = {};
      activeTask.forEach((el) => {
        if (el.value) {
          formData[el.name] = el.value;
        }
      });

      try {
        await createTaskFile(selectedFileName, formData);
        const updatedFormData = activeTask.map((el) => {
          if (el.name === "startCorob" || el.name === "startPallet") {
            return { ...el, value: "1" };
          } else if (selectedAllFileContent) {
            // Проверяем, существует ли selectedAllFileContent и нужные поля в нем
            if (
              el.name === "packaging_per_pallet" &&
              selectedAllFileContent.packaging_per_pallet
            ) {
              return {
                ...el,
                value: selectedAllFileContent.packaging_per_pallet,
              };
            } else if (
              el.name === "pieces_per_package" &&
              selectedAllFileContent.pieces_per_package
            ) {
              return {
                ...el,
                value: selectedAllFileContent.pieces_per_package,
              };
            } else {
              return { ...el, value: "" };
            }
          }
          // Если поле не требует специальной обработки, оставляем его значение как есть
          return el;
        });

        setActiveTask(updatedFormData);
        // setNStatus(NStatus.Success);
        // handleOpenModal();
        notifySuccess("Файл задания создан");
        setIsAddFile(true);
      } catch (error) {
        alert("Failed to create JSON file2");
      }
    } else {
      setNStatus(NStatus.Error);
      handleOpenModal();
    }
    setTimeout(() => {
      setIsAddFile(false);
    }, 200);
  };

  const goToTaskMeneger = () => {
    navigate("/task-meneger");
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {/* {nStatus === NStatus.Error */}
        <ErrorMessage />
        {/* : <CreateMessage />} */}
      </Modal>
      <form className="nomenclatures">
        {activeTask.map(
          ({ label, name, comment, required = false, value }, i) => {
            if (name === "date_manufacture" || name === "date_expiration") {
              let date = null;
              if (value) {
                date = parseDate(value);
              }
              return (
                <DateInput
                  key={i}
                  label={label}
                  isError={!!errors[name]}
                  value={date || null}
                  name={name}
                  onChange={handleDateInputChange(i)}
                  onBlur={required ? handleDateBlur : () => console.log("")}
                />
              );
            } else {
              return (
                <InputWithTooltip
                  key={i}
                  i={i}
                  name={name}
                  tooltipText={comment}
                  label={label}
                  onChange={handleChangeN}
                  onBlur={required ? handleBlur : () => console.log("")}
                  isError={!!errors[name]}
                  required={required}
                  value={value}
                />
              );
            }
          }
        )}
      </form>
      <div className="order-buttons">
        <div className="order-buttons-block">
          <button className="n-button" onClick={goToNomenklatures}>
            Создать номенклатуру
          </button>
          <button className="n-button" onClick={goToTaskMeneger}>
            Управление заданиями
          </button>
        </div>
        <div className="n-buttons">
          <button
            className={`n-button ${dis && "dis"}`}
            disabled={dis}
            onClick={handleSubmit}
          >
            Сохранить задание
          </button>
          <button className="n-button" onClick={getTasks1S}>
            1С задания
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputsBlock;
