import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const FileContent = () => {
  const { selectedFileContent } = useSelector((state: RootState) => state.nomenklanureJson);
  return (
    <>
      {selectedFileContent && selectedFileContent.length ? (
        <div>
          <h3>Описание</h3>
          <ul className="n-list__content">
            {selectedFileContent.map((file, i) => {
              return (
                <li key={i} >
                  {file}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </>
  );
};
export default FileContent;
