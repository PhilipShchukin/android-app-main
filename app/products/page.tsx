'use client';

import BurgerMenu from '../components/shared/BurgerMenu/BurgerMenu';
import ProductsComponent from '@/app/components/Searchnfo/ProductTable/TestComponents/product';
import { ToastContainer } from 'react-toastify';

export default function ProductPage() {
  return (
    <div>
      <BurgerMenu />
      <ProductsComponent />
      <ToastContainer />
    </div>
  );
}
