import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Sidebar.css'; // Nếu có

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="https://res.cloudinary.com/dumvx2lsj/image/upload/v1745728876/logohandmade_ma6cno" alt="Logo" />
      </div>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/users">User List</Link></li>
          <li><Link to="/products">Product</Link></li>
          <li><Link to="/orders">Order</Link></li>
          <li><Link to="/brands">Brand</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
