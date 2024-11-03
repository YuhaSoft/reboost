import React, { useEffect, useState } from 'react';
import './SidebarComponent.css';
import { getIsAdmin, logout } from '../../utils/auth';

interface SidebarProps {
  isOpen: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, handleMouseEnter, handleMouseLeave }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchIsAdmin = async () => {
      const adminStatus = getIsAdmin()??false;
      setIsAdmin(adminStatus);
    };
    fetchIsAdmin();
  }, []);

  return (
    <nav className={`main-menu ${isOpen ? 'open' : 'closed'}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ul>
        <li className="has-subnav">
          <a href="#">
            <i className="fa fa-home fa-2x"></i>
            <span className="nav-text">Home</span>
          </a>
        </li>
        <li className="has-subnav">
          <a href="/profile">
            <i className="fa fa-user fa-2x"></i>
            <span className="nav-text">Profile</span>
          </a>
        </li>
        {isAdmin && (
          <li className="has-subnav">
            <a href="/dashboard">
              <i className="fa fa-user fa-2x"></i>
              <span className="nav-text">Admin Dashboard</span>
            </a>
          </li>
        )}
      </ul>

      <ul className="logout">
        <li>
          <a href="#" onClick={logout}>
            <i className="fa fa-power-off fa-2x"></i>
            <span className="nav-text">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
