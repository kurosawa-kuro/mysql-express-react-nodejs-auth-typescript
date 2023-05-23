// frontend\src\components\PrivateRoute.jsx

import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../state/store.js';

const PrivateRoute = () => {
  const { user } = useUserStore();
  return user ? <Outlet /> : <Navigate to='/login' replace />;
};
export default PrivateRoute;