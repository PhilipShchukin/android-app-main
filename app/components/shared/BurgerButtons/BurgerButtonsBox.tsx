import { useState, useEffect } from "react";
import styles from "./BurgerButtons.module.css";
import { AlignJustify, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

interface BurgerButtonsProps {
  onDelete: () => void;
  onClick: () => void;
  onMove: () => void;
  selectedBoxNumber: number | null;
  isOldMonitoring: boolean;
}

const BurgerButtonsBox = ({
  onDelete,
  onClick,
  onMove,
  selectedBoxNumber,
  isOldMonitoring,
}: BurgerButtonsProps) => {
  const { selectedFileContent } = useSelector(
    (state: RootState) => state.taskJson
  );
  const { selectedAllFileContent } = useSelector(
    (state: RootState) => state.oldSorting
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "visible";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOpen]);

  return (
    <div className={styles.wrapper}>
      {/* Кнопка бургера */}
      <button className={styles.burgerButton} onClick={toggleMenu}>
        {isOpen ? <X size={24} /> : <AlignJustify size={24} />}
      </button>

      {/* Меню с кнопками управления */}
      <div className={`${styles.menuContainer} ${isOpen ? styles.open : ""}`}>
        <nav className={styles.menu}>
          <ul>
            <li>
              <button
                className={`action-button ${!selectedBoxNumber && styles.dis}`}
                onClick={onDelete}
                // disabled={selectedBoxNumber}
              >
                Удалить коробку
              </button>
            </li>
            <li>
              <button
                className={`action-button ${
                  (isOldMonitoring
                    ? selectedAllFileContent || !selectedBoxNumber
                    : selectedFileContent || !selectedBoxNumber) && styles.dis
                }`}
                disabled={!selectedBoxNumber}
                onClick={onClick}
              >
                Печать
              </button>
            </li>
            <li>
              <button
                className={`action-button ${!selectedBoxNumber && styles.dis}`}
                disabled={!selectedBoxNumber}
                onClick={onMove}
              >
                Переместить
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Оверлей */}
      {isOpen && <div className={styles.overlay} onClick={closeMenu} />}
    </div>
  );
};

export default BurgerButtonsBox;
