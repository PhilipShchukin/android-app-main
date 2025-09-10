
import { useState, useEffect } from "react";
import styles from "./BurgerMenu.module.css";
import { AlignJustify, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "visible";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOpen]);

  // Функция для проверки активного пути
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className={styles.wrapper}>
      {/* Кнопка бургера (слева) */}
      <button className={styles.burgerButton} onClick={toggleMenu}>
        {isOpen ? <X size={24} /> : <AlignJustify size={24} />}
      </button>

      {/* Меню, раскрывающееся слева-направо */}
      <div className={`${styles.menuContainer} ${isOpen ? styles.open : ""}`}>
        <nav className={styles.menu}>
          <ul>
            <li>
              <Link
                href="/search"
                onClick={closeMenu}
                className={isActive("/search") ? styles.disabledLink : ""}
                aria-disabled={isActive("/search")}
                tabIndex={isActive("/search") ? -1 : undefined}
              >
                Поиск
              </Link>
            </li>
            <li>
              <Link
                href="/search-global"
                onClick={closeMenu}
                className={isActive("/search-global") ? styles.disabledLink : ""}
                aria-disabled={isActive("/search-global")}
                tabIndex={isActive("/search-global") ? -1 : undefined}
              >
                Глобальный поиск
              </Link>
            </li>
            <li>
              <Link
                href="/boxes"
                onClick={closeMenu}
                className={isActive("/boxes") ? styles.disabledLink : ""}
                aria-disabled={isActive("/boxes")}
                tabIndex={isActive("/boxes") ? -1 : undefined}
              >
                Коробки
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                onClick={closeMenu}
                className={isActive("/products") ? styles.disabledLink : ""}
                aria-disabled={isActive("/products")}
                tabIndex={isActive("/products") ? -1 : undefined}
              >
                Продукты
              </Link>
            </li>
            <li>
              <Link
                href="/pallets"
                onClick={closeMenu}
                className={isActive("/pallets") ? styles.disabledLink : ""}
                aria-disabled={isActive("/pallets")}
                tabIndex={isActive("/pallets") ? -1 : undefined}
              >
                Паллеты
              </Link>
            </li>
            <li>
              <Link
                href="/report"
                onClick={closeMenu}
                className={isActive("/report") ? styles.disabledLink : ""}
                aria-disabled={isActive("/report")}
                tabIndex={isActive("/report") ? -1 : undefined}
              >
                Отгрузка
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Оверлей */}
      {isOpen && <div className={styles.overlay} onClick={closeMenu} />}
    </div>
  );
};

export default BurgerMenu;

