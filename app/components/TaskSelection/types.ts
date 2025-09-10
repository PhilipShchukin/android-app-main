export interface ITask {
  gtin: string; //
  name: string; //
  description?: string;
  ITF14?: string;
  labelBox: string; //
  labelPallet: string; //
  inscriptionLabel?: string;
  techConditions?: string;
  gost?: string;
  otherTechConditions?: string;
  nettoUnit?: string;
  bruttoUnit?: string;
  bruttoBox?: string;
  tTempCond1?: string;
  tempCond2?: string;
  tempCond3?: string;
  tempCond4?: string;
  adInfo1?: string;
  adInfo2?: string;
  adInfo3?: string;
  adInfo4?: string;
  adInfo5?: string;
  adInfo6?: string;

  batch: string; //
  packer?: string;
  date_manufacture: string; //
  date_expiration: string; //
  pieces_per_package: string; //
  packaging_per_pallet: string; //
  startCorob: string; //
  startPallet: string; //
  productCount?: string;
  codes_item?: string;
}

