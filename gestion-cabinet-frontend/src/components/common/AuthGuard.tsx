import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AccountType } from '../../types';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: AccountType[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !requiredRole.includes(user.role as AccountType)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
