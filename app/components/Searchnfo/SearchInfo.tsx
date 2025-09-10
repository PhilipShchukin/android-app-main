"use client";
import React, { useEffect } from "react";
import "./searchInfo.css";
// import ProductTable from "./ProductTable/ProductTable";
import useTemplateDispatch from "@/app/hooks/useTemplateDispatch";

const SearchInfo: React.FC = () => {
  const { getAllTemplates } = useTemplateDispatch();

  useEffect(() => {
    const getAll = async () => {
      await getAllTemplates();
    };
    getAll();
  }, []);

  return <div className="info">{/* <ProductTable /> */}</div>;
};

export default SearchInfo;
