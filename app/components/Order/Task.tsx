import React, { useState } from "react";
import "./order.css";
import List from "../TaskSelection/List";
// import TaskFileContent from "../TaskSelection/List/FileContent/TaskFileContent";
import { NStatus } from "../Nomenclatures/types";
import Modal from "../Modal/Modal";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import DeleteFileMessage from "../Modal/Messages/DeleteFileMessage";
import useTaskDispatch from "@/app/hooks/useTaskDispatch";

const Task: React.FC = () => {
  const { selectedFileName } = useSelector(
    (state: RootState) => state.taskJson
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nStatus, setNStatus] = useState(NStatus.Error);
  const { deleteTaskFile } = useTaskDispatch();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const deleteTaskFileHandler = () => {
    setNStatus(NStatus.Delete);
    handleOpenModal();
  };

  const del = async () => {
    try {
      await deleteTaskFile(selectedFileName);
    } catch (err) {
      console.error("Ошибка при удалении файла задания");
    } finally {
      handleCloseModal();
    }
  };

  const dis = !selectedFileName;

  return (
    <div className="task">
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {
          <DeleteFileMessage
            file={selectedFileName}
            cancel={handleCloseModal}
            del={del}
          />
        }
      </Modal>
      <div className="task__content">
        <List />
        {/* <TaskFileContent /> */}
      </div>
      <button
        className={`n-button ${dis && "dis"}`}
        onClick={deleteTaskFileHandler}
        disabled={dis}
      >
        Удалить
      </button>
    </div>
  );
};

export default Task;
