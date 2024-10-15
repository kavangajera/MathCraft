import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Renders the matched child route */}
      </main>
    </>
  );
};

export default Layout;
