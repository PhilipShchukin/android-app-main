import { useState, useEffect } from "react";
import styles from "./BurgerButtons.module.css";
import { AlignJustify, X } from "lucide-react";

interface BurgerButtonsProps {
  onDelete: () => void;
  onAdd: () => void;
  onClear: () => void;
  isDeleteDisabled: boolean;
  isAddDisabled: boolean;
}

const BurgerButtons = ({
  onDelete,
  onAdd,
  onClear,
  isDeleteDisabled,
  isAddDisabled,
}: BurgerButtonsProps) => {
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
                onClick={() => {
                  onDelete();
                  closeMenu();
                }}
                disabled={isDeleteDisabled}
                // className={isDeleteDisabled ? styles.disabled : ""}
                className={`action-button ${isDeleteDisabled && styles.dis}`}
              >
                Удалить продукты
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onAdd();
                  closeMenu();
                }}
                disabled={!isAddDisabled}
                // className={isAddDisabled ? styles.disabled : ""}
                className={`action-button ${!isAddDisabled && styles.dis}`}
              >
                Добавить продукты
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onClear();
                  closeMenu();
                }}
                // className={`action-button ${isDeleteDisabled && styles.dis}`}
                // disabled={isDeleteDisabled}
                className={`action-button`}
              >
                Очистить выбор
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

export default BurgerButtons;
