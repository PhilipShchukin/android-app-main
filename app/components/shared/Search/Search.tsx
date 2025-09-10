"use client";
import React, { KeyboardEvent, useEffect } from "react";

import styles from "./search.module.css";
import { ChangeEvent, useState } from "react";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import useSearchDispatch from "@/app/hooks/useSearchDispatch";
import { findBoxPage } from "./helper";
import { useDispatch, useSelector } from "react-redux";
import { searhChangeBoxNumberPage } from "@/app/store/DBWorkSlice";
import { RootState } from "@/app/store/store";
import { itemsPerPage } from "@/app/helpers/constants";

function Search() {
  const [inputs, setInputs] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [currentRes, setCurrentRes] = useState<string>("");

  const [boxNumber, setBoxNumber] = useState();
  const [allBoxNumbers, setAllBoxNumber] = useState([]);

  const { getSearchCode } = useSearchDispatch();

  //@ts-ignore
  // const searchCurrentPage = findBoxPage(boxNumber, allBoxNumbers, itemsPerPage);
  const searchCurrentPage = findBoxPage(
    boxNumber,
    allBoxNumbers || [],
    itemsPerPage
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(searhChangeBoxNumberPage(searchCurrentPage));
  }, [boxNumber]);


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = currentInput.trim();

      const boxProd = getSearchCode(trimmed)
        .then((boxProd) => {
          //@ts-ignore
          if (boxProd?.message) {
            // console.log(boxProd.message); // "Коробка не найдена"
            //@ts-ignore

            setCurrentRes(boxProd.message);
          }
          //@ts-ignore

          if (boxProd?.from === "box") {
            // console.log(boxProd.code.box_number); // Номер коробки
            setCurrentRes(
              //@ts-ignore

              `Коробка ${boxProd.code.box_number} находится в палете ${boxProd.code.pallet_number} `
            );
            //@ts-ignore
            setBoxNumber(boxProd.code.box_number);
            //@ts-ignore
            setAllBoxNumber(boxProd.allBoxNumbers);
          }
          //@ts-ignore

          if (boxProd?.from === "code") {
            // console.log(boxProd.code.box_number); // Номер коробки

            setCurrentRes(
              //@ts-ignore

              // `Продукт ${boxProd.code.box_number} находится в коробке ${boxProd.code.box_number} `
              `Продукт находится в коробке ${boxProd.code.box_number} `
            );
          }
        })
        .catch((err) => {
          console.error("Ошибка запроса:", err);
        });
      console.log(boxProd);

      if (trimmed) {
        setInputs((prev) => [...prev, trimmed]);
        setCurrentInput("");
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  // const handleClear = () => {
  //   setInputs([]);
  // };
  return (
    <div className={styles.search}>
      <BurgerMenu />
      <input
        type="text"
        value={currentInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Введите штрихкод"
        autoFocus
      />
      
      <div className="">{currentRes}</div>
    </div>
  );
}

export default Search;
