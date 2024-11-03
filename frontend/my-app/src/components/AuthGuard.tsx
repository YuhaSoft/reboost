import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../utils/auth';

const AuthGuard: React.FC = () => {
  const token = getToken();

  return token ? <Outlet /> : <Navigate to="/auth" />;
};

export default AuthGuard;
