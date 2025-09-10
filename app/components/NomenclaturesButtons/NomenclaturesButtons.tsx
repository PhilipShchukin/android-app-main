import React from "react";
import "./nomenclaturesButtons.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface INomenclaturesButtons {
  handleSubmit: any;
  editN: any;
  deleteFile: any;
}

const NomenclaturesButtons: React.FC<INomenclaturesButtons> = ({
  handleSubmit,
  editN,
  deleteFile,
}) => {
  const { selectedFileContent } = useSelector((state: RootState) => state.nomenklanureJson);
  const dis = !selectedFileContent.length;
  return (
    <div className="n-buttons">
      <button className="n-button" onClick={handleSubmit}>
        Сохранить
      </button>
      <button
        className={`n-button ${dis && "dis"}`}
        onClick={editN}
        disabled={dis}
      >
        Редактировать
      </button>
      <button
        className={`n-button ${dis && "dis"}`}
        onClick={deleteFile}
        disabled={dis}
      >
        Удалить
      </button>
    </div>
  );
};

export default NomenclaturesButtons;
