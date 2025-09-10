'use client';

import ProductTableContent from '@/app/components/Searchnfo/ProductTable/ProductTableContent';

import React from 'react';

import { useSelector } from 'react-redux';

import { RootState } from '@/app/store/store';

import '../../../Searchnfo/ProductTable/productTable.css';

export default function ProductsComponent() {
  const { boxResponce, allBoxes, selectedBoxNumber } = useSelector(
    (state: RootState) => state.DBWork,
  );
  console.log(boxResponce, 'boxResponce');
  return (
    <>
      <div className="tab-content">
        <ProductTableContent
          boxResponce={boxResponce}
          allBoxes={allBoxes}
          selectedBoxNumber={selectedBoxNumber}
        />
      </div>
    </>
  );
}
