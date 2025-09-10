'use client';

import { ToastContainer } from 'react-toastify';
import BurgerMenu from '../components/shared/BurgerMenu/BurgerMenu';
import Report from '../components/shared/Search/report/Report';

export default function SearchPage() {
  return (
    <div>
      <BurgerMenu />

      <Report />

      <ToastContainer />
    </div>
  );
}
