import { ITask } from "../components/TaskSelection/types";

// Функция для преобразования JSON в список
export function formatNomJsonToReadableList(data: ITask) {
  let output = [];
  output.push(data.name);
  output.push(data.gtin);
  output.push(data.description || '');
  output.push(data.ITF14 || '');

  return output.join("\n");
}

export function formatTaskJsonToReadableList(data: ITask) {
  let output = [];
  output.push(data.gtin);
  output.push(data.name);
  output.push(data.pieces_per_package);
  output.push(data.packaging_per_pallet);
  output.push(data.batch);
  output.push(data.date_manufacture);
  output.push(data.date_expiration);
  output.push(data.labelBox);
  output.push(data.labelPallet);
  output.push(data.startCorob);
  output.push(data.startPallet);
  output.push(data.ITF14 || '');

  return output.join("\n");
}

export const getJSONNomList = (data: ITask) => {
  const res = formatNomJsonToReadableList(data).split("\n");
  return res;
};

export const mergeJsonFiles = (file1: any, file2: any) => {
  return { ...file1, ...file2 };
};

export function formatRecordJsonToReadableList(data: any) {
  let output = [];
  output.push(`name: ${data.name}`);
  output.push(`GTIN: ${data.gtin}`);
  output.push(`pieces_per_package: ${data.pieces_per_package}`);
  output.push(`batch: ${data.batch}`);

  return output.join("\n");
}

