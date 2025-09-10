import React, { useEffect } from "react";
import "./nomenclaturesLists.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Nomenclature from "./Nomenclature";
import FileContent from "./FileContent";
import useNomenclaturesDispatch from "@/app/hooks/useNomenclaturesDispatch";

interface IList {
  addFile: boolean;
}

const NomenclaturesList: React.FC<IList> = ({ addFile }) => {
  const { getNomFiles } = useNomenclaturesDispatch();
  const { jsonFiles, selectedFileName } = useSelector(
    (state: RootState) => state.nomenklanureJson
  );
  // Функция для получения списка файлов
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getNomFiles();
      } catch (err) {
        console.error("Ошибка при получении списка файлов");
      }
    };

    fetchFiles();
  }, [addFile]);

  // Функция для получения содержимого выбранного файла

  useEffect(() => {
    if (!jsonFiles.includes(selectedFileName)) {
      // dispatch(saveJsonFileContent([]));
    }
    console.log("useEffect---jsonFiles", jsonFiles.includes(selectedFileName));
  }, [jsonFiles]);

  return (
    <div className="n-list">
      <Nomenclature />
      <FileContent />
    </div>
  );
};

export default NomenclaturesList;
