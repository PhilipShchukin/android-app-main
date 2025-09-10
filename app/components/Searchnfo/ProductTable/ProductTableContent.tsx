import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddProductInLastBox from "./AddProductInLastBox/AddProductInLastBox";
import { ProductTableContentProps } from "./types";
import PauseMessageBox from "../../Modal/Messages/PauseMonitoringMessageBox";
import LanguageMessage from "../../Modal/Messages/LanguageMessage";
import useSearchDispatch from "@/app/hooks/useSearchDispatch";
import Modal from "../../Modal/Modal";
import useMonitoringDispatch from "@/app/hooks/useMonitoringDispatch";
import {
  saveAllBoxesRequest,
  saveBoxRequest,
  changeBoxNumber,
} from "@/app/store/DBWorkSlice";
import { RootState } from "@/app/store/store";
import BurgerButtons from "../../shared/BurgerButtons/BurgerButtons";

const ProductTableContent: React.FC<ProductTableContentProps> = ({
  boxResponce,
  allBoxes,
  selectedBoxNumber,
}) => {
  const atF8Symbol = process.env.REACT_APP_F8_AT_SYMBOL || "@";
  const dispatch = useDispatch();
  const { deleteCodes } = useSearchDispatch();
  const { pauseMonitoring } = useMonitoringDispatch();
  const { isMonitoring, isPause, currentBoxNumber } = useSelector(
    (state: RootState) => state.monitoring
  );
  const { selectedFileContent } = useSelector(
    (state: RootState) => state.taskJson
  );
  const { selectedFileContentBoxLimit } = useSelector(
    (state: RootState) => state.oldSorting
  );
  const { getSearchByBoxNumber } = useSearchDispatch();
  console.log(selectedBoxNumber, "selectedBoxNumber");

  useEffect(() => {
    const getProductData = async () => {
      await getSearchByBoxNumber(selectedBoxNumber || 1);
    };
    getProductData();
  }, []);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<"add" | "delete" | null>(
    null
  );
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const handleMessageOpenModal = () => {
    setIsMessageModalOpen(true);
  };

  const handleMessageCloseModal = () => {
    setIsMessageModalOpen(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const transliteratedValue = transliterate(event.target.value);
    setSearchValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "F8") {
      event.preventDefault();
      setSearchValue((prev) => prev + atF8Symbol);
    }
    // Определение языка раскладки
    if (event.key.length === 1) {
      // Проверяем, что это символ
      const isRussian = /[а-яё]/i.test(event.key); // Проверяем, является ли символ русским

      if (isRussian) {
        handleMessageOpenModal();
        return; // Прерываем выполнение, чтобы не производить поиск
      }
    }

    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleSearchSubmit = () => {
    const foundIndex = boxResponce.findIndex(
      (el) => el.code.replaceAll("\x1D", atF8Symbol) === searchValue
    );
    if (foundIndex !== -1) {
      toggleRowSelection(foundIndex);
    }
    setSearchValue("");
  };

  const handleOpenAddModal = () => {
    setModalContent("add");
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setModalContent("delete");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(index)
        ? prevSelectedRows.filter((row) => row !== index)
        : [...prevSelectedRows, index]
    );
  };

  const performDelete = async () => {
    const codesToDelete = selectedRows.map((index) => ({
      code: boxResponce[index].code,
      boxNumber: boxResponce[index].box_number,
    }));
    const remainingItems = boxResponce.filter(
      (_, index) => !selectedRows.includes(index)
    );
    await deleteCodes(codesToDelete);
    dispatch(saveBoxRequest(remainingItems));
    const newAllBoxes = allBoxes.map((el) => {
      if (+el.box_number === selectedBoxNumber) {
        return { ...el, code_count: remainingItems.length };
      }
      return el;
    });
    dispatch(saveAllBoxesRequest(newAllBoxes));
    setSelectedRows([]);
  };

  const deleteCodesHandler = async () => {
    // console.log('------------', currentBoxNumber, '=====', '~~~~~~', boxResponce[0].box_number);
    if (
      isMonitoring &&
      !isPause &&
      +currentBoxNumber === +boxResponce[0].box_number
    ) {
      handleOpenDeleteModal();
    } else {
      await performDelete();
    }
  };

  const handlePause = async () => {
    await pauseMonitoring();
    handleCloseModal();
  };

  const handleNoPause = () => {
    handleCloseModal();
  };

  const addCodesHandler = async () => {
    // console.log('------------2', currentBoxNumber, '=====', '~~~~~~', boxResponce[0].box_number);
    if (
      isMonitoring &&
      !isPause &&
      +currentBoxNumber === +boxResponce[0].box_number
    ) {
      handleOpenDeleteModal();
    } else {
      handleOpenAddModal();
    }
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case "add":
        return boxResponce[0] ? (
          <AddProductInLastBox boxNumber={boxResponce[0].box_number} />
        ) : (
          "Нет выбранной коробки!"
        );
      case "delete":
        return <PauseMessageBox pause={handlePause} cancel={handleNoPause} />;
      default:
        return null;
    }
  };

  const tableHeader = (
    <thead>
      <Modal
        isOpen={isMessageModalOpen}
        onClose={handleMessageCloseModal}
        autoCloseDelay={3}
      >
        <LanguageMessage />
      </Modal>
      <tr>
        <th className="thTd leftColumn">
          <div className="search-container">
            <input
              type="text"
              ref={inputRef}
              placeholder="Отсканируйте код"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </th>
      </tr>
      <tr>
        <th className="thTd leftColumn" style={{ fontSize: "28px" }}>
          Продукты
        </th>
      </tr>
    </thead>
  );

  const renderRows = () => {
    if (boxResponce.length === 0) {
      return null;
    }
    return (
      <>
        <tr>
          <td className="thTd leftColumn" rowSpan={boxResponce.length + 1}>
            Короб {boxResponce[0].box_number}
          </td>
        </tr>
        {boxResponce.map((item, index) => (
          <tr
            key={index}
            onClick={() => {
              toggleRowSelection(index);
            }}
            className={selectedRows.includes(index) ? "selected-item" : ""}
          >
            <td className="thTd rightColumn">
              {/* {item.code.length > 40 */}
              {item.code.length > 20
                ? // ? `${item.code.substring(0, 35)}...`
                  `${item.code.substring(0, 15)}...`
                : item.code}
            </td>
          </tr>
        ))}
      </>
    );
  };

  const dis = !selectedRows.length;

  const { getBoxLimit } = useSearchDispatch();

  const [boxBolForButton, setBoxBulForButton] = useState<boolean>(true);

  useEffect(() => {
    const fetchBoxLimit = async () => {
      const limit = await getBoxLimit();
      if (boxResponce.length >= limit) {
        setBoxBulForButton(false);
      }
    };
    fetchBoxLimit();
  }, []);

  let disAddProduct = false;
  if (selectedFileContent) {
    disAddProduct =
      +selectedFileContent.pieces_per_package === boxResponce.length;
  } else if (selectedFileContentBoxLimit) {
    disAddProduct = selectedFileContentBoxLimit === boxResponce.length;
  }

  return (
    <>
      <div className="tab-content">
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {renderModalContent()}
        </Modal>
        <table className="table">
          {tableHeader}
          <tbody className="tbody">{renderRows()}</tbody>
        </table>
        <div className="button-group right">
          {/* <button
            className={`action-button ${dis && "dis"}`}
            disabled={dis}
            onClick={deleteCodesHandler}
          >
            Удалить продукты
          </button>
          <button
            className={`action-button ${disAddProduct && "dis"}`}
            disabled={disAddProduct}
            onClick={addCodesHandler}
          >
            Добавить продукты
          </button>

          <button
            className={`action-button ${dis && "dis"}`}
            disabled={dis}
            onClick={() => setSelectedRows([])}
          >
            Очистить выбор
          </button> */}
          <BurgerButtons
            onDelete={deleteCodesHandler}
            onAdd={addCodesHandler}
            onClear={() => setSelectedRows([])}
            isDeleteDisabled={dis}
            // isDeleteDisabled={Boolean(!selectedRows)}
            isAddDisabled={boxBolForButton}
            // isAddDisabled={Boolean(!selectedRows)}
          />
        </div>
      </div>
    </>
  );
};

export default ProductTableContent;
