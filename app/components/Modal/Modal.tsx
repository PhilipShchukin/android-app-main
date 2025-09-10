import React, { CSSProperties, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./modal.css"; // Импортируйте стили

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  styles?: CSSProperties;
  stylesOverlay?: CSSProperties;
  autoCloseDelay?: number;  // Опциональная задержка в секундах
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  styles,
  stylesOverlay,
  autoCloseDelay, // Опциональная задержка в секундах
  onMouseEnter,
  onMouseLeave,
}) => {
  const autoCloseTimer = useRef<NodeJS.Timeout | null>(null); // Храним таймер в useRef

  // Функция для запуска таймера
  const startAutoCloseTimer = () => {
    if (autoCloseDelay) {
      autoCloseTimer.current = setTimeout(() => {
        onClose(); // Закрываем модальное окно
      }, autoCloseDelay * 1000);
    }
  };

  // Функция для остановки таймера
  const stopAutoCloseTimer = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Отключаем скроллинг
      startAutoCloseTimer(); // Запускаем таймер при открытии
    }

    return () => {
      document.body.style.overflow = "unset"; // Включаем обратно при закрытии
      stopAutoCloseTimer(); // Очищаем таймер при размонтировании
    };
  }, [isOpen, autoCloseDelay, onClose]); // Зависимости для useEffect

  // Обработчик наведения мыши
  const handleMouseEnter = () => {
    stopAutoCloseTimer(); // Останавливаем таймер
    if (onMouseEnter) onMouseEnter(); // Вызываем переданный обработчик
  };

  // Обработчик ухода мыши
  const handleMouseLeave = () => {
    startAutoCloseTimer(); // Возобновляем таймер
    if (onMouseLeave) onMouseLeave(); // Вызываем переданный обработчик
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" style={stylesOverlay}>
      <div
        className="modal"
        style={styles}
        onMouseEnter={handleMouseEnter} // Добавлено
        onMouseLeave={handleMouseLeave} // Добавлено
      >
        <button className="close-button" onClick={onClose}>
          &times; {/* Символ закрытия */}
        </button>
        {children}
      </div>
    </div>,
    document.body // Рендерим в body
  );
};

export default Modal;