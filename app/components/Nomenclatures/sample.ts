import { IDefaultNomenclatures } from "./types";

export const NOMENCLATURES: IDefaultNomenclatures[] = [
  // { name: 'rootName', label: 'Наименование документа', comment: 'Если поле остается пустым, то имя будет "GTIN".' },
  { name: "gtin", label: "GTIN продукта", comment: "GTIN", required: true },
  {
    name: "name",
    label: "Название продукта",
    comment: "название отображаемое в окне программы для оператора",
    required: true,
  },
  {
    name: "description",
    label: "Описание продукта",
    comment: "Описание продукта",
  },
  {
    name: "ITF14",
    label: "ITF14",
    comment: "Код который печатается на коробке",
  },
  {
    name: "labelBox",
    label: "Название шаблона этикетка",
    comment: "Название шаблона этикетка.",
    required: true,
  },
  {
    name: "labelPallet",
    label: "Название шаблона паллеты",
    comment: "Название шаблона Паллеты",
    required: true,
  },
  {
    name: "pieces_per_package",
    label: "Количество продуктов в коробе",
    comment: "Количество маркируемых продуктов в коробе число ограничено 4",
    required: true,
  },
  {
    name: "packaging_per_pallet",
    label: "Количество коробов в паллете",
    comment: "Количество коробов в паллете",
    required: true,
  },
  {
    name: "inscriptionLabel",
    label: "Имя на этикетке продукта",
    comment: "Имя на этикетке продукта",
  },
  {
    name: "techConditions",
    label: "Технические условия",
    comment: "Технические условия",
  },
  { name: "gost", label: "ГОСТ", comment: "ГОСТ" },
  {
    name: "otherTechConditions",
    label: "Прочие условия",
    comment: "Прочие условия",
  },
  {
    name: "nettoUnit",
    label: "Нетто одной единицы",
    comment: "Вес нетто одной единицы продукта в граммах",
  },
  {
    name: "bruttoUnit",
    label: "Брутто одной единицы",
    comment: "Вес брутто одной единицы продукта в граммах.",
  },
  {
    name: "bruttoBox",
    label: "Брутто коробки",
    comment: "Вес брутто одной коробки.",
  },
  {
    name: "tempCond1",
    label: "Температурные условия 1",
    comment: "Температурные условия 1.",
  },
  {
    name: "tempCond2",
    label: "Температурные условия 2",
    comment: "Температурные условия 2.",
  },
  {
    name: "tempCond3",
    label: "Температурные условия 3",
    comment: "Температурные условия 3.",
  },
  {
    name: "tempCond4",
    label: "Температурные условия 4",
    comment: "Температурные условия 4.",
  },
  {
    name: "adInfo1",
    label: "Дополнительная информация1",
    comment: "Дополнительная динамическая информация, текстовая1",
  },
  {
    name: "adInfo2",
    label: "Дополнительная информация2",
    comment: "Дополнительная динамическая информация, текстовая2",
  },
  {
    name: "adInfo3",
    label: "Дополнительная информация3",
    comment: "Дополнительная динамическая информация, текстовая3",
  },
  {
    name: "adInfo4",
    label: "Дополнительная информация4",
    comment: "Дополнительная динамическая информация, текстовая4",
  },
  {
    name: "adInfo5",
    label: "Дополнительная информация5",
    comment: "Дополнительная динамическая информация, текстовая5",
  },
  {
    name: "adInfo6",
    label: "Дополнительная информация6",
    comment: "Дополнительная динамическая информация, текстовая6",
  },
];
