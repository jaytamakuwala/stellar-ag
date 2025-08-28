import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/common';

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
