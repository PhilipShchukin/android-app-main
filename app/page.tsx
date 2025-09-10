"use client";

import styles from "./page.module.css";
import BurgerMenu from "./components/shared/BurgerMenu/BurgerMenu";


import BoxComponent from "@/app/components/Searchnfo/ProductTable/TestComponents/box";

export default function Home() {
  

  return (
    <div className={styles.container}>
      <BurgerMenu />

      <BoxComponent />

    </div>
  );
}
