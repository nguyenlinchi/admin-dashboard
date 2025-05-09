// Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import './styles/Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default Layout;
