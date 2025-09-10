"use client";

import React, { useState } from "react";
import "../../../Searchnfo/ProductTable/productTable.css";

import { useSelector } from "react-redux";

import { RootState } from "@/app/store/store";
import PalletTableContent from "@/app/components/Searchnfo/ProductTable/PalletTableContent";
import Pagination from "@/app/components/Searchnfo/ProductTable/Pagination";
import useSearchDispatch from "@/app/hooks/useSearchDispatch";

// interface IPalletComponentProps {
//   fetchData: any;
//   totalPallets: number;
//   itemsPerPage: number;
//   currentPalletPage: number;
//   handlePalletPageChange: (pageNumber: number) => void;
// }

export default function PalletComponent(
  {
    // fetchData,
    // totalPallets,
    // itemsPerPage,
    // currentPalletPage,
    // handlePalletPageChange,
  }
) {
  const { allPallets } = useSelector((state: RootState) => state.DBWork);

  const { getAllPalets } = useSearchDispatch();

  const [currentPalletPage, setCurrentPalletPage] = useState(1);
  const [totalPallets, setTotalPallets] = useState(0);
  const itemsPerPage = 50;

  const fetchData = async () => {
    const palletsData = await getAllPalets(currentPalletPage, itemsPerPage);

    if (palletsData) {
      setTotalPallets(palletsData.total);
    }
  };

  const handlePalletPageChange = (pageNumber: number) => {
    setCurrentPalletPage(pageNumber);
  };

  return (
    <>
      <div className="tab-wrapper">
        <PalletTableContent allPallets={allPallets} fetchData={fetchData} />
        <Pagination
          totalItems={totalPallets}
          itemsPerPage={itemsPerPage}
          currentPage={currentPalletPage}
          handlePageChange={handlePalletPageChange}
        />
      </div>
    </>
  );
}
