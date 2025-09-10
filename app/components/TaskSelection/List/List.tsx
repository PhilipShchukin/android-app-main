import "./list.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useEffect } from "react";
import { saveTaskFileName } from "../../../store/taskJsonSlice";
import useTaskDispatch from "@/app/hooks/useTaskDispatch";

const List = () => {
  const dispatch = useDispatch();
  const { getTaskFileContent, getTaskFiles } = useTaskDispatch();
  const { jsonFiles, selectedFileName } = useSelector(
    (state: RootState) => state.taskJson
  );
  const { taskName, isSorting, isUnfinishedTask } = useSelector(
    (state: RootState) => state.monitoring
  );
  // console.log('List________', taskName);

  useEffect(() => {
    if (!selectedFileName && taskName) {
      dispatch(saveTaskFileName(taskName));
      handleFileClick(taskName);
    }
  }, [taskName]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        await getTaskFiles();
      } catch (err) {
        console.error("Ошибка при получении списка файлов заданий");
      }
    };

    fetchFiles();
  }, []);

  const handleFileClick = async (filename: string) => {
    try {
      await getTaskFileContent(filename);
    } catch (err) {
      console.error("Ошибка при получении файла задания.");
    }
  };

  return (
    <div className={"task-list "}>
      {(isSorting || isUnfinishedTask) && <div className="task-list__black" />}
      <h3>Список заданий</h3>
      {jsonFiles && jsonFiles.length ? (
        <ul className="tack-list__list">
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

export default List;
