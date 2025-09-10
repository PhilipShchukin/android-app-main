'use client';
import React, { KeyboardEvent, ChangeEvent, useState, useEffect, useRef } from 'react';
import styles from './search.module.css';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import useSearchDispatch from '@/app/hooks/useSearchDispatch';
import { findBoxPage } from './helper';
import { useDispatch } from 'react-redux';
import { searhChangeBoxNumberPage } from '@/app/store/DBWorkSlice';
import { itemsPerPage } from '@/app/helpers/constants';
import { parseCodeHelper } from './parce.helper';

interface IProductInfo {
  gtin: string;
  batch: string;
  date: string;
  originalDate: string;
  fullTableName: string;
}

interface ISearchResponse {
  message?: string;
  from?: 'box' | 'code';
  code?: {
    box_number: number;
    pallet_number: number;
    box_label?: string;
    pallet_label?: string | null;
  };
  tableNames?: IProductInfo[];
  countInBox?: number;
}

export default function SearchGlobal() {
  const [currentInput, setCurrentInput] = useState<string>('');
  const [currentRes, setCurrentRes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBox, setIsBox] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { getCodeSearchGlobal } = useSearchDispatch();
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const keepFocus = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };

    keepFocus();
    const interval = setInterval(keepFocus, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const processBarcode = (rawCode: string): string => {
    const cleanCode = rawCode.replace(/^[\x00-\x1F]+/, '');
    return cleanCode.slice(16);
  };

  const handleSearch = async (code: string) => {
    if (!code || isLoading) return;

    setIsLoading(true);
    setCurrentRes('');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const processedCode = processBarcode(code);

      if (processedCode.startsWith('21')) {
        const response = await getCodeSearchGlobal(code);
        setIsBox(true);
        //@ts-ignores
        handleSearchResponse(response);
      } else {
        const parsedData = parseCodeHelper(code);

        if (parsedData) {
          setIsBox(false);
          setCurrentRes(formatParsedData(parsedData));
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Ошибка поиска:', error);
        setCurrentRes('Ошибка при обработке запроса');
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const formatParsedData = (data: any): string => {
    return (
      `GTIN: ${data.gtin}\n` +
      `Дата производства: ${data.productionDate}\n` +
      `Дата годности: ${data.expiryDate}\n` +
      `Номер партии: ${data.batchNumber}\n` +
      `Количество: ${data.quantity}\n` +
      `Номер ${data.containerType === 'box' ? 'коробки' : 'паллеты'}: ${data.containerNumber}`
    );
  };

  function extractLastNumbers(strings: string[]): string {
    return strings
      .map((str) => {
        // 1. Находим последний '-'
        const lastDashIndex = str.lastIndexOf('-');
        if (lastDashIndex === -1) return ''; // Если '-' нет

        // 2. Берём часть после '-' (например, "2025_08_06_16_30_08")
        const afterDash = str.slice(lastDashIndex + 1);

        // 3. Разбиваем по '_' и берём последний элемент
        const parts = afterDash.split('_');
        return parts[parts.length - 1]; // "08"
      })
      .filter((num) => num !== '') // Убираем пустые
      .join(', ');
  }

  const handleSearchResponse = (response: ISearchResponse) => {
    if (!response) {
      setCurrentRes('Нет данных');
      return;
    }

    // Проверяем, что tableNames определён перед обращением к его свойству length
    if (response.tableNames && response.tableNames.length > 1) {
      // const BoxCodeSearchGlobal = extractLastNumbers(response.tableNames as []);
      setCurrentRes(`Продукт находится в нескольких фасовках `);
      return;
    }

    if (response.message) {
      setCurrentRes(response.message);
      return;
    }

    let result = '';

    if (response.from === 'box' && response.code) {
      result = `Коробка ${response.code.box_number} находится в палете ${response.code.pallet_number}`;
    } else if (response.from === 'code' && response.code) {
      result = `Продукт находится в коробке ${response.code.box_number}`;
    }

    // Добавляем информацию о продуктах из tableNames
    if (response.tableNames && response.tableNames.length > 0) {
      response.tableNames.forEach((product) => {
        result +=
          `\n\nПродукт:\n` +
          `GTIN: ${product.gtin}\n` +
          `Партия: ${product.batch}\n` +
          `Дата производства: ${product.date}`;
      });
    }

    if (response.from === 'box' && response.code?.box_number) {
      const page = findBoxPage(response.code.box_number, [], itemsPerPage);
      dispatch(searhChangeBoxNumberPage(page));
    }

    setCurrentRes(result);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(currentInput.trim());
      setCurrentInput('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const parsedData = parseCodeHelper(currentInput);

  return (
    <div className={styles.search}>
      <BurgerMenu />
      <input
        type="text"
        ref={inputRef}
        value={currentInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Введите штрихкод глобал. поиска"
        disabled={isLoading}
        autoFocus
      />
      {isLoading && <div className={styles.loading}>Поиск...</div>}

      {currentRes ? (
        <div className={styles.result}>
          {currentRes.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      ) : parsedData && !isBox ? (
        <div>...loading</div>
      ) : null}
    </div>
  );
}
