import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import "./sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '⏴' : '⏵'}
      </div>
      <h2 className={`sidebar-title ${!isOpen ? 'hidden' : ''}`}>Меню</h2>
      <NavLink to={"/card"} activeClassName="active-link" className={`sidebar-link ${!isOpen ? 'hidden' : ''}`}>
      Администратор
      </NavLink>
      <NavLink to={"/storage"} activeClassName="active-link" className={`sidebar-link ${!isOpen ? 'hidden' : ''}`}>
        Склад
      </NavLink>
    </div>
  );
};

export default Sidebar;
