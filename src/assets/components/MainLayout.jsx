import React from 'react';
import Navbar from './navbar/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Outlet /> {/* Le contenu des routes s'affichera ici */}
      </div>
    </>
  );
};

export default MainLayout;
