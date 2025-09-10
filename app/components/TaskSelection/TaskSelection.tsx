import { useDispatch, useSelector } from "react-redux";
import List from "./List";
import "./taskSelection.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import {
  changeMonitoringStatus,
  changeOldMonitoringStatus,
  clearCountsMonitoring,
  changePauseStatus,
  changeIsUnfinishedTask,
} from "../../store/monitoringSlice";
import {
  clearAllBoxRequest,
  clearAllPalletRequest,
  clearBoxRequest,
  saveCodeRequest,
} from "../../store/DBWorkSlice";
import { validateFileContent } from "./helper";
import useMonitoringDispatch from "@/app/hooks/useMonitoringDispatch";
import useTemplateDispatch from "@/app/hooks/useTemplateDispatch";
import useTaskDispatch from "@/app/hooks/useTaskDispatch";

const titleText = "Выбор задания для фасовки";

const TaskSelection = () => {
  const {
    getMonitoringStatus,
    startMonitoring,
    stopMonitoring,
    pauseMonitoring,
    continuedMonitoring,
    getIsUnfinishedTask,
  } = useMonitoringDispatch();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getAllTemplates } = useTemplateDispatch();
  const { selectedFileContent, selectedFileName } = useSelector(
    (state: RootState) => state.taskJson
  );
  const {
    isMonitoring,
    isSorting,
    isOldMonitoring,
    isPause,
    isUnfinishedTask,
  } = useSelector((state: RootState) => state.monitoring);
  const { getTaskFiles } = useTaskDispatch();
  const [title, setTitle] = useState(titleText);
  const [message, setMessage] = useState("");

  // console.log('TaskSelection------------- ____________', isUnfinishedTask);

  const fetchFiles = async () => {
    try {
      await getTaskFiles();
    } catch (err) {
      console.error("Ошибка при получении списка файлов заданий");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    const checkMonitoringStatus = async () => {
      await getMonitoringStatus();
    };
    checkMonitoringStatus();
  }, []);

  useEffect(() => {
    const checkUnfinishedTask = async () => {
      await getIsUnfinishedTask();
    };
    checkUnfinishedTask();
  }, []);

  const handleStartAggregation = async () => {
    if (!selectedFileContent) {
      setMessage("Пожалуйста, выберите задание.");
      setTimeout(() => setMessage(""), 3000); // Скрыть сообщение через 3 секунды
      return;
    }

    if (!validateFileContent(selectedFileContent)) {
      setMessage("Содержимое файла не соответствует условиям.");
      setTimeout(() => setMessage(""), 3000); // Скрыть сообщение через 3 секунды
      return;
    }

    console.log("Начать агрегацию");
    try {
      await startMonitoring(selectedFileName, selectedFileContent.gtin);
      dispatch(changeMonitoringStatus(true));
      dispatch(clearCountsMonitoring());
      await getAllTemplates();
      navigate("/work");
    } catch (error) {
      console.error("Ошибка при запуске мониторинга:", error);
    }
  };

  const handleStop = async () => {
    console.log("Остановить");
    try {
      await stopMonitoring();
      dispatch(changeIsUnfinishedTask(false));
      dispatch(changeMonitoringStatus(false));
      dispatch(changeOldMonitoringStatus(false));
      dispatch(clearCountsMonitoring());
      dispatch(clearBoxRequest());
      dispatch(clearAllBoxRequest());
      dispatch(clearAllPalletRequest());
      dispatch(changePauseStatus(false));
      dispatch(saveCodeRequest(null));
      setTimeout(() => {
        fetchFiles();
      }, 1000);
    } catch (error) {
      console.error("Ошибка при остановке мониторинга:", error);
    }
  };

  // TODO доделть для старой сортировки
  const handlePause = async () => {
    console.log("Пауза/Продолжение");
    try {
      if (isPause) {
        await continuedMonitoring();
      } else {
        await pauseMonitoring();
      }
    } catch (error) {
      console.error("Ошибка при паузе мониторинга:", error);
    }
  };

  useEffect(() => {
    if (isMonitoring && selectedFileName) {
      setTitle(`Фасуется ${selectedFileName} задание`);
    } else if (isOldMonitoring) {
      setTitle(`Фасуется старое ${selectedFileName} задание`);
    } else {
      setTitle(titleText);
    }
  }, [isMonitoring, isOldMonitoring]);

  return (
    <div className="task">
      <h1>{title}</h1>
      <div className="task__content">
        <List />
        {/* <TaskFileContent /> */}
      </div>
      <div className="button-group">
        {message && <div className="message">{message}</div>}
        {isSorting ? (
          <>
            <button className="stop-button" onClick={handlePause}>
              {isPause ? "Продолжить" : "Пауза"}
            </button>
            <button className="stop-button" onClick={handleStop}>
              Завершить задание
            </button>
          </>
        ) : (
          <div className="task-button-group">
            {!isUnfinishedTask ? (
              <button
                className={
                  !selectedFileContent
                    ? "start-button disabled-button"
                    : "start-button"
                }
                onClick={handleStartAggregation}
              >
                Начать агрегацию
              </button>
            ) : (
              <button
                className={
                  !selectedFileContent
                    ? "start-button disabled-button"
                    : "start-button"
                }
                onClick={handleStartAggregation}
              >
                Продолжить агрегацию
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSelection;
