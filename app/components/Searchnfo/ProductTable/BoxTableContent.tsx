import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BoxTableContentProps, MessageType } from "./types";
import useMonitoringDispatch from "@/app/hooks/useMonitoringDispatch";
import {
  changeIsRequest,
  changeBoxNumber,
  saveCodeRequest,
  saveAllBoxesRequest,
  saveBoxRequest,
} from "@/app/store/DBWorkSlice";
import Modal from "../../Modal/Modal";
import { MessageContent } from "../../Modal/Messages/types";
import PauseMessageBox from "../../Modal/Messages/PauseMonitoringMessageBox";
import MoveMessage from "../../Modal/Messages/MoveMessage";
import LanguageMessage from "../../Modal/Messages/LanguageMessage";
import DeleteMessage from "../../Modal/Messages/DeleteMessage";
import { printBox } from "@/app/API/settingsApi";
import useSearchDispatch from "@/app/hooks/useSearchDispatch";
import { RootState } from "@/app/store/store";
import BurgerButtonsBox from "../../shared/BurgerButtons/BurgerButtonsBox";

import "../ProductTable/productTable.css";

const BoxTableContent: React.FC<BoxTableContentProps> = ({
  fetchData,
  currentBoxPage,
  searchResultBoxNumber,
}) => {
  const atF8Symbol = process.env.REACT_APP_F8_AT_SYMBOL || "@";
  const { selectedBoxNumber, allBoxes, allPallets } = useSelector(
    (state: RootState) => state.DBWork
  );

  const { isOldMonitoring, isPause, isMonitoring } = useSelector(
    (state: RootState) => state.monitoring
  );
  const dispatch = useDispatch();
  const { getSearchByBoxNumber, deleteBox, getSearchCode, moveBoxToPalleta } =
    useSearchDispatch();
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageType, setMessageType] = useState<MessageType>(
    MessageType.Delete
  );
  const [prevQuery, setPrevQuery] = useState("");
  const [searchValue, setSearchValue] = useState(""); // Состояние для хранения значения поиска
  const inputRef = useRef<HTMLInputElement>(null); // Реф для поля ввода
  const [selectedPallet, setSelectedPallet] = useState<number | null>(null);
  const [isDelMessageModalOpen, setIsDelMessageModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pauseMonitoring } = useMonitoringDispatch();

  const handleDelMessageOpenModal = () => {
    setIsDelMessageModalOpen(true);
  };

  const handleDelMessageCloseModal = () => {
    setIsDelMessageModalOpen(false);
  };

  const handlePause = async () => {
    await pauseMonitoring();
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenMessageModal = () => setIsMessageModalOpen(true);
  const handleCloseMessageModal = () => setIsMessageModalOpen(false);

  const handleSelectPallet = (palletNumber: number) => {
    setSelectedPallet(palletNumber);
  };

  const handleMove = async () => {
    if (selectedPallet && selectedBoxNumber) {
      const res = await moveBoxToPalleta(selectedBoxNumber, selectedPallet);
    }
    handleCloseMessageModal();
  };

  useEffect(() => {
    fetchData();
  }, [currentBoxPage]);

  useEffect(() => {
    if (searchResultBoxNumber !== undefined) {
      dispatch(changeBoxNumber(+searchResultBoxNumber));
    }
  }, [searchResultBoxNumber]);

  useEffect(() => {
    if (selectedRowRef.current && tbodyRef.current) {
      const row = selectedRowRef.current;
      const tbody = tbodyRef.current;
      const rowTop = row.offsetTop;
      const rowBottom = rowTop + row.offsetHeight;
      const tbodyScrollTop = tbody.scrollTop;
      const tbodyHeight = tbody.clientHeight;

      if (rowTop < tbodyScrollTop) {
        tbody.scrollTop = rowTop;
      } else if (rowBottom > tbodyScrollTop + tbodyHeight) {
        tbody.scrollTop = rowBottom - tbodyHeight;
      }
    }
  }, [selectedBoxNumber]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Устанавливаем фокус на поле ввода при загрузке компонента
    }
  }, []);

  const changeBoxHandler = async (box: any) => {
    const { box_number } = box;
    await getSearchByBoxNumber(+box_number);
    dispatch(changeBoxNumber(+box_number));
  };

  const deleteBoxHandler = async () => {
    if (!selectedBoxNumber) {
      return;
    }
    // if (isMonitoring && !isPause && +currentBoxNumber! === +selectedBoxNumber) {
    if (isMonitoring && !isPause) {
      // setIsModalOpen(true);
    } else {
      setMessageType(MessageType.Delete);
      handleOpenMessageModal();
    }
  };

  const handlerDeleteBox = async () => {
    await performDeleteBox();
    handleCloseMessageModal();
  };

  const moveBoxHandler = async () => {
    if (!selectedBoxNumber) {
      return;
    }
    setMessageType(MessageType.MoveBox);
    handleOpenMessageModal(); // Открываем модальное окно, если условия выполняются
  };

  const performDeleteBox = async () => {
    if (selectedBoxNumber) {
      await deleteBox(selectedBoxNumber);
      const newAllBoxes = allBoxes.filter(
        (el) => +el.box_number !== +selectedBoxNumber
      );
      dispatch(saveAllBoxesRequest(newAllBoxes));
      dispatch(saveBoxRequest([]));
      dispatch(saveCodeRequest(null));
    }
  };

  const handleLabelPrint = async () => {
    if (selectedBoxNumber) {
      const selectedBox = allBoxes.find(
        (box) => box.box_number === selectedBoxNumber
      );
      if (selectedBox) {
        await printBox(selectedBoxNumber, +selectedBox.code_count);
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const transliteratedValue = transliterate(event.target.value); // Транслитерация вводимого текста
    setSearchValue(event.target.value); // Обновляем состояние поиска
  };

  const handleSearch = async () => {
    console.log("Поиск:", searchValue);
    const query = searchValue;
    dispatch(changeIsRequest(true)); // Устанавливаем состояние запроса в true
    setSearchValue("");
    if (query !== prevQuery) {
      setPrevQuery(query);
      try {
        await getSearchCode(query);
      } catch (error) {
        console.error("Ошибка при поиске:", error);
      } finally {
        // Задержка выполнения dispatch(changeIsRequest(false)) на 2 секунды
        setTimeout(() => {
          dispatch(changeIsRequest(false));
        }, 2000);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "F8") {
      event.preventDefault();
      setSearchValue((prev) => prev + atF8Symbol); // Добавляем символ @ при нажатии F8
    }
    // Определение языка раскладки
    if (event.key.length === 1) {
      // Проверяем, что это символ
      const isRussian = /[а-яё]/i.test(event.key); // Проверяем, является ли символ русским

      if (isRussian) {
        handleDelMessageOpenModal();
        return; // Прерываем выполнение, чтобы не производить поиск
      }
    }

    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const tableHeader = (
    <thead>
      <Modal
        isOpen={isDelMessageModalOpen}
        onClose={handleDelMessageCloseModal}
        autoCloseDelay={3}
      >
        <LanguageMessage />
      </Modal>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <PauseMessageBox cancel={handleCloseModal} pause={handlePause} />
      </Modal>
      <tr>
        <th className="thTd leftColumn">
          <div className="search-container">
            <input
              type="text"
              ref={inputRef}
              placeholder="Отсканируйте этикетку"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </th>
      </tr>
      <tr>
        <th className="thTd leftColumn " style={{ fontSize: "28px" }}>
          Коробки
        </th>
      </tr>
    </thead>
  );

  const renderRows = () => {
    if (allBoxes.length === 0) {
      return (
        <tr>
          <td className="thTd leftColumn" colSpan={2}>
            Нет данных
          </td>
        </tr>
      );
    }
    const sortedBoxes = [...allBoxes].sort(
      (a, b) => a.box_number - b.box_number
    );
    return sortedBoxes.map((box, index) => {
      return (
        <tr
          key={index}
          ref={selectedBoxNumber === box.box_number ? selectedRowRef : null}
          onClick={() => changeBoxHandler(box)}
          className={selectedBoxNumber === box.box_number ? "selected" : ""}
        >
          <td className="thTd leftColumn">Короб {box.box_number}</td>
          <td className="thTd rightColumn">{box.code_count} шт.</td>
        </tr>
      );
    });
  };

  return (
    <div className="tab-content">
      <Modal isOpen={isMessageModalOpen} onClose={handleCloseMessageModal}>
        {messageType === MessageType.Delete ? (
          <DeleteMessage
            content={MessageContent.Box}
            del={handlerDeleteBox}
            cancel={handleCloseMessageModal}
          />
        ) : (
          <MoveMessage
            move={handleMove}
            cancel={handleCloseMessageModal}
            pallets={allPallets}
            selectedPalletNumber={selectedPallet}
            onSelectPallet={handleSelectPallet}
          />
        )}
      </Modal>
      <table className="table">
        {tableHeader}
        <tbody
          className="tbody"
          ref={tbodyRef}
          style={{ overflowY: "auto", maxHeight: "385px" }}
        >
          {renderRows()}
        </tbody>
      </table>
      <div className="button-group right">
        <BurgerButtonsBox
          onDelete={deleteBoxHandler}
          onClick={handleLabelPrint}
          onMove={moveBoxHandler}
          selectedBoxNumber={selectedBoxNumber}
          isOldMonitoring={isOldMonitoring}
        />
      </div>
    </div>
  );
};

export default BoxTableContent;
