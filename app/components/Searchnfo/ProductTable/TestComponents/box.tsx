"use client";

import React, { useEffect, useState } from "react";
import "../../../Searchnfo/ProductTable/productTable.css";

import Pagination from "@/app/components/Searchnfo/ProductTable/Pagination";
import BoxTableContent from "../BoxTableContent";
import useSearchDispatch from "@/app/hooks/useSearchDispatch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

import { itemsPerPage } from "@/app/helpers/constants";
import { searhChangeBoxNumberPage } from "@/app/store/DBWorkSlice";

export default function BoxComponent() {
  const { getAllBoxes } = useSearchDispatch();
  const { currentBoxPage } = useSelector((state: RootState) => state.DBWork);

  // const [currentBoxPage, setCurrentBoxPage] = useState(1);

  const [totalBoxes, setTotalBoxes] = useState(0);

  const fetchData = async () => {
    const boxesData = await getAllBoxes(currentBoxPage, itemsPerPage);
    console.info("aaaaa");
    if (boxesData) {
      setTotalBoxes(boxesData.total);
    }
  };
  const dispatch = useDispatch();

  const handleBoxPageChange = (pageNumber: number) => {
    // setCurrentBoxPage(pageNumber);
    dispatch(searhChangeBoxNumberPage(pageNumber));
  };
  useEffect(() => {
    if (!currentBoxPage && currentBoxPage > 0) {
      // setCurrentBoxPage(searchBoxPageNumber);
      dispatch(searhChangeBoxNumberPage(currentBoxPage));
    }
  });
  console.log(currentBoxPage, "currentBoxPage");

  return (
    <>
      <div className="tab-wrapper">
        <BoxTableContent
          fetchData={fetchData}
          currentBoxPage={currentBoxPage}
        />
        <Pagination
          totalItems={totalBoxes}
          itemsPerPage={itemsPerPage}
          currentPage={currentBoxPage}
          handlePageChange={handleBoxPageChange}
        />
      </div>
    </>
  );
}
