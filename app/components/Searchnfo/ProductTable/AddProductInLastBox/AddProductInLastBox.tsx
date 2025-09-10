import React, { useEffect, useState, useRef } from "react";
import "./addProductInLastBox.css";
import { useDispatch, useSelector } from "react-redux";
import LanguageMessage from "@/app/components/Modal/Messages/LanguageMessage";
import Modal from "@/app/components/Modal/Modal";
import { saveBoxRequest } from "@/app/store/DBWorkSlice";
import useSearchDispatch from "@/app/hooks/useSearchDispatch";
import { RootState } from "@/app/store/store";

const AddProductInLastBox = ({ boxNumber }: { boxNumber: number }) => {
  const { selectedFileContent } = useSelector(
    (state: RootState) => state.taskJson
  );
  const { selectedAllFileContent } = useSelector(
    (state: RootState) => state.oldSorting
  );
  const { boxResponce } = useSelector((state: RootState) => state.DBWork);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { addCodeToBox, getSearchByBoxNumber } = useSearchDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Определение раскладки по введенному тексту
  const isRussianInput = (text: string): boolean => {
    return /[а-яёА-ЯЁ]/.test(text);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getActualBoxContent = async () => {
      setIsLoading(true);
      await getSearchByBoxNumber(boxNumber);
      setIsLoading(false);
    };
    getActualBoxContent();
  }, [boxNumber]);

  const handleSave = async () => {
    if (isRussianInput(searchQuery)) {
      handleOpenModal();
      setSearchQuery("");
      return;
    }
    console.log(
      "---------selectedFileContent========",
      selectedFileContent,
      "=======",
      selectedAllFileContent
    );
    console.log(
      "---------selectedFileContent========222",
      boxResponce,
      "======="
    );
    if (!selectedFileContent) {
      if (boxResponce.length < +selectedAllFileContent.pieces_per_package) {
        try {
          setIsLoading(true);
          const res = await addCodeToBox(
            searchQuery,
            boxNumber,
            boxResponce[0].pallet_number!
          );

          if (res && !res.message) {
            const newBoxCodes = [
              ...boxResponce,
              {
                id: res.id,
                code: searchQuery,
                box_number: boxNumber,
                pallet_number: boxResponce[0].pallet_number!,
              },
            ];
            dispatch(saveBoxRequest(newBoxCodes));
            setSearchResult(`Код добавлен в короб ${boxNumber}`);
          } else {
            setSearchResult(res?.message || "Ошибка добавления");
          }
        } catch (error) {
          console.error("Ошибка сохранения:", error);
          setSearchResult("Ошибка сохранения");
        } finally {
          setIsLoading(false);
          setSearchQuery("");
          inputRef.current?.focus();
        }
      } else {
        setSearchResult(`Лимит коробки ${boxNumber} достигнут`);
        setSearchQuery("");
        inputRef.current?.focus();
      }
    } else {
      if (boxResponce.length < +selectedFileContent.pieces_per_package) {
        try {
          setIsLoading(true);
          const res = await addCodeToBox(
            searchQuery,
            boxNumber,
            boxResponce[0].pallet_number!
          );

          if (res && !res.message) {
            const newBoxCodes = [
              ...boxResponce,
              {
                id: res.id,
                code: searchQuery,
                box_number: boxNumber,
                pallet_number: boxResponce[0].pallet_number!,
              },
            ];
            dispatch(saveBoxRequest(newBoxCodes));
            setSearchResult(`Код добавлен в короб ${boxNumber}`);
          } else {
            setSearchResult(res?.message || "Ошибка добавления");
          }
        } catch (error) {
          console.error("Ошибка сохранения:", error);
          setSearchResult("Ошибка сохранения");
        } finally {
          setIsLoading(false);
          setSearchQuery("");
          inputRef.current?.focus();
        }
      } else {
        setSearchResult(`Лимит коробки ${boxNumber} достигнут`);
        setSearchQuery("");
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "F8") {
      e.preventDefault();
      setSearchQuery((prev) => prev + "\u001D");
      return;
    }

    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Автофокус при загрузке и после операций
  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, isModalOpen]);

  return (
    <div className="hand-work">
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} autoCloseDelay={3}>
        <LanguageMessage />
      </Modal>

      <div className="hand-work-product-search-result">
        <code>{searchResult}</code>
      </div>

      <div className="search-component">
        <div className="search-box">
          <input
            type="text"
            ref={inputRef}
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ввод кода (английская раскладка)"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProductInLastBox;
