import React from "react";
import "./styles.css";

interface IDeleteMessage {
  move: () => void;
  cancel: () => void;
  pallets: { pallet_number: number; box_count: number }[];
  selectedPalletNumber: number | null; // Передаем выбранную паллету из родителя
  onSelectPallet: (palletNumber: number) => void; // Обработчик выбора паллеты
}

const MoveMessage = ({ move, cancel, pallets, selectedPalletNumber, onSelectPallet }: IDeleteMessage) => {
  return (
    <div className="delete-message">
      <h2>Перемещение</h2>
      <p>Для перемещения коробки выберите паллету, в которую нужно ее переместить:</p>

      <div className="pallet-list">
        {pallets.map((pallet) => (
          <button
            key={pallet.pallet_number}
            onClick={() => onSelectPallet(pallet.pallet_number)}
            className={selectedPalletNumber === pallet.pallet_number ? "selected" : ""}
          >
            Паллета {pallet.pallet_number} (Коробок: {pallet.box_count})
          </button>
        ))}
      </div>

      <div className="button-move-group">
        <button onClick={move} disabled={!selectedPalletNumber}>
          Переместить
        </button>
        <button onClick={cancel}>Отмена</button>
      </div>
    </div>
  );
};

export default MoveMessage;