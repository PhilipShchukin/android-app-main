import React, { FocusEvent, useState } from "react";
import "./nomenclatures.css";
import { NOMENCLATURES } from "./sample";
import InputWithTooltip from "../Inputs/Input";
import { validateInput, validateITF14 } from "./validation";
import FileUploadForm from "../Inputs/FileUploadForm";
import Modal from "../Modal/Modal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { NStatus, anyObject } from "./types";
import ErrorMessage from "../Modal/Messages/ErrorMessage";
import CreateMessage from "../Modal/Messages/CreateMessage";
import NomenclaturesList from "../NomenclaturesList/NomenclaturesList";
import NomenclaturesButtons from "../NomenclaturesButtons/NomenclaturesButtons";
import DeleteFileMessage from "../Modal/Messages/DeleteFileMessage";
import { notifySuccess } from "../../API/apiClient";
import useNomenclaturesDispatch from "@/app/hooks/useNomenclaturesDispatch";

const Nomenclatures: React.FC = () => {
  const initialN = useSelector((state: RootState) => state.initialN);
  const { selectedFileName, selectedAllFileContent } = useSelector(
    (state: RootState) => state.nomenklanureJson
  );

  const { deleteNomFile, createNomFile } = useNomenclaturesDispatch();

  const [activeNomenclatures, setActiveNomenclatures] =
    useState<any[]>(initialN);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [isAddFile, setIsAddFile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nStatus, setNStatus] = useState(NStatus.Error);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Обработка изменения инпута label
  const handleChangeLabelN = (index: number, newValue: string) => {
    const updatedData = activeNomenclatures.map((item, i) =>
      i === index ? { ...item, value: newValue } : item
    );
    setActiveNomenclatures(updatedData);
  };

  const handleChangeN = (index: number, newValue: string) => {
    const updatedData = activeNomenclatures.map((item, i) => {
      if (i === index) {
        const { name } = item;
        if (
          name === "gtin" ||
          name === "pieces_per_package" ||
          name === "packaging_per_pallet"
        ) {
          // Ограничиваем ввод только числами для gtin
          const numericValue = newValue.replace(/\D/g, "");
          return { ...item, value: numericValue };
        }
        // Добавьте другие условия для других имен импутов, если необходимо
        return { ...item, value: newValue };
      }
      return item;
    });
    setActiveNomenclatures(updatedData);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateInput(name, value, setErrors, errors);
  };

  const handleBlurITF14 = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateITF14(name, value, setErrors, errors);
  };

  const handleBlurFile = (inputName: string, value: string) => {
    validateInput(inputName, value, setErrors, errors);
  };

  const del = async () => {
    try {
      await deleteNomFile(selectedFileName);
    } catch (err) {
      console.error("Ошибка при удалении файла");
    } finally {
      handleCloseModal();
    }
  };

  const deleteJSONFile = () => {
    setNStatus(NStatus.Delete);
    handleOpenModal();
  };

  const editN = () => {
    if (selectedFileName) {
      const updatedFormData = activeNomenclatures.map((el) => {
        return {
          ...el,
          value: selectedAllFileContent[el.name] || "",
        };
      });
      isAllSuccess(updatedFormData);
      setActiveNomenclatures(updatedFormData);
    }
  };

  const isAllSuccess = (data?: any) => {
    const requiredKeys = NOMENCLATURES.filter((item) => item.required) // Фильтруем по полю required
      .map((item) => item.name); // Получаем только имена ключей

    // Проверяем наличие всех обязательных ключей в formData
    const isAllRequired = () => {
      const newErrors: any = {};
      requiredKeys.forEach((key) => {
        const a = data
          ? data.filter((el: any) => el.name === key)[0].value
          : activeNomenclatures.filter((el) => el.name === key)[0].value;
        if (!a) {
          newErrors[key] = "err";
        } else if (key === "gtin" || key === "ITF14") {
          if (a.length !== 14) {
            newErrors[key] = "err";
          } else {
            newErrors[key] = "";
          }
        } else {
          newErrors[key] = "";
        }
      });
      setErrors(newErrors);
      return newErrors;
    };
    const allRequiredKeysPresent = Object.values(isAllRequired()).every(
      (value) => !value
    );
    const isFormValid = Object.values(errors).every((error) => !error);

    return isFormValid && allRequiredKeysPresent;
  };

  const handleSubmit = async () => {
    if (isAllSuccess()) {
      const formData: anyObject = {};
      activeNomenclatures.forEach((el) => {
        if (el.value) {
          formData[el.name] = el.value;
        }
      });
      let rootName = formData.gtin;
      if (formData["ITF14"]) {
        rootName = `${formData.gtin}_${formData["ITF14"]}`;
      }

      try {
        await createNomFile(rootName, formData);
        const updatedFormData = activeNomenclatures.map((el) => {
          return { ...el, value: "" };
        });

        setActiveNomenclatures(updatedFormData);
        // setNStatus(NStatus.Success);
        // handleOpenModal();
        notifySuccess("Файл номенклатуры создан");
        setIsAddFile(true);
      } catch (error) {
        alert("Failed to create JSON file");
      }
    } else {
      setNStatus(NStatus.Error);
      handleOpenModal();
    }
    setTimeout(() => {
      setIsAddFile(false);
    }, 200);
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {nStatus === NStatus.Error ? (
          <ErrorMessage />
        ) : nStatus === NStatus.Success ? (
          <CreateMessage />
        ) : (
          <DeleteFileMessage
            file={selectedFileName}
            cancel={handleCloseModal}
            del={del}
          />
        )}
      </Modal>
      <form className="nomenclatures">
        {activeNomenclatures &&
          activeNomenclatures.length &&
          activeNomenclatures.map(
            ({ label, name, comment, required = false, value }, i) => {
              if (name === "labelBox" || name === "labelPallet") {
                return (
                  <FileUploadForm
                    i={i}
                    key={i}
                    name={name}
                    tooltipText={comment}
                    label={label}
                    onChange={handleChangeLabelN}
                    onBlur={handleBlurFile}
                    isError={!!errors[name]}
                    value={value}
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
                    onBlur={
                      required
                        ? handleBlur
                        : name === "ITF14"
                        ? handleBlurITF14
                        : () => console.log("")
                    }
                    isError={!!errors[name]}
                    required={required}
                    value={value}
                  />
                );
              }
            }
          )}
      </form>
      <div className="nomenclatures-button">
        <NomenclaturesList addFile={isAddFile} />
        <NomenclaturesButtons
          handleSubmit={handleSubmit}
          editN={editN}
          deleteFile={deleteJSONFile}
        />
      </div>
    </div>
  );
};

export default Nomenclatures;
