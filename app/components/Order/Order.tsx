import React, { useEffect, useState } from "react";
import "./order.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import NomenclaturesList from "../NomenclaturesList/NomenclaturesList";
import InputsBlock from "./ImputsBlok";
import { anyObject } from "../Nomenclatures/types";
import { IInputData } from "../../store/types";

const Order: React.FC = () => {
  const initialTask = useSelector((state: RootState) => state.initialOrder);
  const { selectedAllFileContent, selectedFileName } = useSelector((state: RootState) => state.nomenklanureJson);

  const [activeTask, setActiveTask] = useState<IInputData[]>(initialTask);
  const [errors, setErrors] = useState<anyObject>({});
  const [isAddFile, setIsAddFile] = useState(false);
  const [isSelect, setIsSelect] = useState(false);

  useEffect(() => {
    const handelSelectJSON = () => {
      setIsSelect(true);

      if (selectedAllFileContent) {
        const keys = Object.keys(selectedAllFileContent);
        setActiveTask(
          activeTask.map((el, i) => {
            if (keys.includes(el.name)) {
              console.log(el, keys, i, selectedAllFileContent);

              const r = { ...el, value: selectedAllFileContent[el.name] };
              return r;
            }
            return el;
          })
        );
      }
    };
    handelSelectJSON();
  }, [selectedFileName]);

  return (
    <div className="order">
      <NomenclaturesList addFile={isAddFile} />
      {isSelect && (
        <InputsBlock
          activeTask={activeTask}
          setActiveTask={setActiveTask}
          errors={errors}
          setErrors={setErrors}
          setIsAddFile={setIsAddFile}
        />
      )}
    </div>
  );
};

export default Order;
