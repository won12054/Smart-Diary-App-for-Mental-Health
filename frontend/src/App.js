// Import React
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import DiaryPage from './components/DiaryPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DashboardNew from './components/DashboardNew';
import AdminPage from './components/AdminPage'; // Admin page component
import LoginPage from './components/LoginPage'; // Import the login page component
import SignUpPage from './components/SignupPage'; // Import the signup page component

// Import styles
import './styles/App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role); 
    }
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role); 
    localStorage.setItem('access_token', 'sample-token');
    localStorage.setItem('user_role', role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
  };

  return (
    <Router>
      <div className='app'>
        <Header />
        <div className='main-layout'>
          {/* Render Sidebar only when the user is logged in */}
          {isLoggedIn && <Sidebar onLogout={handleLogout} userRole={userRole} />}
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/admin" element={userRole === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
                <Route path="/" element={userRole !== 'admin' ? <DashboardNew /> : <Navigate to="/admin" />} />
                <Route path="/diary" element={<DiaryPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<SignUpPage onSignUp={handleLogin} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
