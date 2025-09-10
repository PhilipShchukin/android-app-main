import React, { useState, useRef, useEffect } from "react";
import search from "../../../pictures/svg/search.svg";
import { validateCode } from "./helper";
import { useDispatch, useSelector } from "react-redux";
import { ISearchProps } from "./types";
// import { transliterate } from "../../../../../../../../aggregation-po-division_v2/src/global-helper"; // Подключаем ваш метод транслитерации
import useSearchDispatch from "@/app/hooks/useSearchDispatch";
import { ISearchRes } from "@/app/store/types";
import { RootState } from "@/app/store/store";

const respString = "Код не найден в базе";

const Search: React.FC<ISearchProps> = ({ boxPageChange }) => {
  const { currentGtin } = useSelector((state: RootState) => state.DBWork);
  const { getSearchCodeForBox } = useSearchDispatch();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchResult, error]);

  const getResponse = (res: ISearchRes | null): string => {
    let a = "Окно состояния поиска";

    if (res) {
      const { pallet_number, box_number } = res;
      a = `Код находится в ${pallet_number} палете, в ${box_number} коробке`;
    } else {
      a = "код не найден";
    }
    return a;
  };

  const handleSearch = async () => {
    if (validateCode(searchQuery, currentGtin, setError)) {
      // console.log('-------------1');
      const res = await getSearchCodeForBox(searchQuery);
      if (res && res.code) {
        setSearchResult(getResponse(res.code));
        if (boxPageChange) {
          // console.log('handleSearch^^^^^^^^^^', res.pageNumber);
          // dispatch(changeBoxNumber(res.code.box_number));
          boxPageChange(res.pageNumber);
        }
      } else {
        setSearchResult(respString);
        // dispatch(changeBoxNumber(null));
      }
      setError("");
    } else {
      // console.log('-------------2');
      setSearchResult("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const transliteratedValue = transliterate(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-component">
      <div className="search-status">
        <p>{searchResult || error}</p>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Окно ввода поиска"
        />
        <button className="search-button" onClick={handleSearch}>
          <img src={search} alt="Поиск" width="25" height="25" />
        </button>
      </div>
    </div>
  );
};

export default Search;
