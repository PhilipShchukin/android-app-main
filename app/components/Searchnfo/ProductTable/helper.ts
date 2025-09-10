import { ISearchRes } from "@/app/store/types";
import { Dispatch, SetStateAction } from "react";

export const validateCode = (code: string, number: string, setError: Dispatch<SetStateAction<string>>): boolean => {
  if (code.length !== 33) {
    console.error('Ошибка: длина кода не равна 33 символам');
    setError('Длина кода не равна 33 символам')
    return false;
  }
  if (!code.startsWith('01')) {
    console.error('Ошибка: код не начинается с "01"');
    setError('Код не начинается с "01"')
    return false;
  }
  const numericPart = code.slice(2, 16);
  if (numericPart !== number) {
    console.error('Ошибка: числовая часть кода не совпадает с заданным числом');
    setError('Числовая часть кода не совпадает с заданным числом')
    return false;
  }
  return true;
};

export const getResponse = (res: ISearchRes | null): string => {
  let a = 'Окно состояния поиска';

  if (res) {
    const { pallet_number, box_number } = res;
    a = `Код находится в ${pallet_number} палете, в ${box_number} коробке`;
  } else {
    a = 'код не найден';
  }
  return a;
};