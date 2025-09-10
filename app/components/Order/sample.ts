import { IDefaultNomenclatures } from "../Nomenclatures/types";

export const ORDER: IDefaultNomenclatures[] = [
  { name: "batch", label: "Партия", comment: "", required: true },
  { name: "packer", label: "Упаковщик", comment: "" },
  { name: "workSH", label: "Рабочая смена", comment: "" },
  {
    name: "date_manufacture",
    label: "Дата начала срока годности",
    comment: "",
    required: true,
  },
  {
    name: "date_expiration",
    label: "Дата окончания срока годности",
    comment: "",
    required: true,
  },
  {
    name: "pieces_per_package",
    label: "Количество продуктов в коробе",
    comment: "",
    required: true,
  },
  {
    name: "packaging_per_pallet",
    label: "Количество коробов в паллете",
    comment: "",
    required: true,
  },
  {
    name: "startCorob",
    label: "Номер начального короба",
    comment: "",
    required: true,
  },
  {
    name: "startPallet",
    label: "Номер начальной паллеты",
    comment: "",
    required: true,
  },
  // {
  //   name: "productCount",
  //   label: "Завершить при достижении N числа продуктов",
  //   comment: "",
  // },
  // {
  //   name: "codes_item",
  //   label: "Добавления списка DM кодов",
  //   comment: "Добавления списка DM кодов",
  // },
];
