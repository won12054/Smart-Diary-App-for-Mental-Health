import React from 'react';
import Breadcrumb from './Breadcrumb';
import Navigation from './Navigation';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Navigation />
      <Breadcrumb />
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
