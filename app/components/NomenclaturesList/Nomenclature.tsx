import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useNomenclaturesDispatch from "@/app/hooks/useNomenclaturesDispatch";

const Nomenclature = () => {
  const { getNomFileContent } = useNomenclaturesDispatch();
  const { jsonFiles, selectedFileName } = useSelector(
    (state: RootState) => state.nomenklanureJson
  );

  const handleFileClick = async (filename: string) => {
    try {
      await getNomFileContent(filename);
    } catch (err) {
      console.error("Ошибка при получении файла");
    }
  };

  return (
    <div>
      <h3>Список Наменклатур</h3>
      {jsonFiles && jsonFiles.length ? (
        <ul className="n-list__list">
          {jsonFiles.map((file, i) => {
            return (
              <li
                key={i}
                onClick={() => handleFileClick(file)}
                className={file === selectedFileName ? "selected" : ""}
              >
                {file}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default Nomenclature;
