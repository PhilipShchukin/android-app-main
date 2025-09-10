import { useState, useEffect } from "react";
import styles from "./BurgerButtons.module.css";
import { AlignJustify, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

interface BurgerButtonsProps {
  onDelete: () => void;
  onPrint: () => void;
  selectedPalletNumber: number | null;
}

const BurgerButtonsPallet = ({
  onDelete,
  onPrint,
  selectedPalletNumber,
}: BurgerButtonsProps) => {
  const { selectedFileContent } = useSelector(
    (state: RootState) => state.taskJson
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
                className={`action-button ${
                  !selectedPalletNumber && styles.dis
                }`}
                // className={`action-button `}
                disabled={Boolean(!selectedPalletNumber)}
                onClick={onDelete}
              >
                Удалить паллету
              </button>
            </li>

            <li>
              <button
                className={`action-button ${
                  (!selectedFileContent || !selectedPalletNumber) && styles.dis
                }`}
                onClick={onPrint}
              >
                Печать
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

export default BurgerButtonsPallet;
