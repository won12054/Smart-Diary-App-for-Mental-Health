import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../images/wellmind-logo-clean.png';

const Header = () => {
  const location = useLocation();

  // Determine the title based on the current path
  const getTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/diary':
        return 'Diary';
      case '/chatbot':
        return 'Chatbot';
      default:
        return 'Well-Mind';
    }
  };

  return (
    <div className='header-container'>
      <div className='header-left'>
        <Link to="/">
        <img className='logo' src={logo} alt="Logo" />
        </Link>
      </div>
      <div className='header-right'>
        <h1 className='app-title'>{getTitle(location.pathname)}</h1>
      </div>
    </div>
  );
};

export default Header;