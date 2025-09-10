export interface Nomenclature {
  gtin: string;
  name: string;
  description: string;
  ITF14: string;
  labelBox: string;
  labelPallet: string;
  inscriptionLabel: string;
  techConditions: string;
  gost: string;
  otherTechConditions: string;
  nettoUnit: string;
  bruttoUnit: string;
  bruttoBox: string;
  tTempCond1: string;
  tempCond2: string;
  tempCond3: string;
  tempCond4: string;
  adInfo1: string;
  adInfo2: string;
  adInfo3: string;
  adInfo4: string;
  adInfo5: string;
  adInfo6: string;
}

export interface anyObject {
  [key: string]: any;
}

export interface IDefaultNomenclatures {
  name: string;
  label: string;
  comment: string;
  required?: boolean;
}

export interface IFormDataN {
  name: string;
  label: string;
  comment: string;
  value: string;
  required?: boolean;
}

export enum NStatus {
  Error = "error",
  Success = "success",
  Delete = "delete",
}
