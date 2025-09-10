import React from "react";

interface PalletTableProps {
  allPallets: any[];
  selectedPalletNumber: number | null;
  onPalletSelect: (pallet: any) => void;
}

const PalletTable: React.FC<PalletTableProps> = ({
  allPallets,
  selectedPalletNumber,
  onPalletSelect,
}) => {
  const tableHeader = (
    <thead>
      <tr>
        <th className="thTd leftColumn" style={{ fontSize: "28px" }}>
          Паллеты
        </th>
      </tr>
    </thead>
  );

  const renderRows = () => {
    if (allPallets.length === 0) {
      return (
        <tr>
          <td className="thTd leftColumn" colSpan={2}>
            Нет данных
          </td>
        </tr>
      );
    }

    const sortedPallets = [...allPallets].sort(
      (a, b) => a.pallet_number - b.pallet_number
    );
    return sortedPallets.map((pallet, index) => (
      <tr
        key={index}
        onClick={() => onPalletSelect(pallet)}
        className={
          selectedPalletNumber === pallet.pallet_number ? "selected" : ""
        }
      >
        <td className="thTd leftColumn">Паллета {pallet.pallet_number}</td>
        <td className="thTd rightColumn">
          Коробок в паллете {pallet.box_count}
        </td>
      </tr>
    ));
  };

  return (
    <table className="table">
      {tableHeader}
      <tbody className="tbody">{renderRows()}</tbody>
    </table>
  );
};

export default PalletTable;
