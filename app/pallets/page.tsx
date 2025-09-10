'use client';

import BurgerMenu from '../components/shared/BurgerMenu/BurgerMenu';

import PalletComponent from '@/app/components/Searchnfo/ProductTable/TestComponents/pallet';

import { ToastContainer } from 'react-toastify';

export default function PalletPage() {
  return (
    <div>
      <BurgerMenu />
      <PalletComponent />
      <ToastContainer />
    </div>
  );
}
