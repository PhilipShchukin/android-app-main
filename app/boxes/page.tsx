"use client";

import BurgerMenu from "../components/shared/BurgerMenu/BurgerMenu";

import BoxComponent from "@/app/components/Searchnfo/ProductTable/TestComponents/box";
import PalletComponent from "@/app/components/Searchnfo/ProductTable/TestComponents/pallet";
import ProductsComponent from "@/app/components/Searchnfo/ProductTable/TestComponents/product";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BoxPage() {
  return (
    <div>
      <BurgerMenu />

      <BoxComponent />
      <ToastContainer />

      {/* <BurgerButtons /> */}
    </div>
  );
}
