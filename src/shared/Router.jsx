import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import CommissionWrite from '../pages/CommissionWrite';
import CommissionList from '../pages/CommissionList';
import CommissionDetail from '../pages/CommissionDetail';
import UserOrders from '../pages/UserOrders';
import MyPage from '../pages/Mypage';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Public Only Routes (for non-authenticated users) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Protected Routes (for authenticated users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mypage/:email" element={<MyPage />} />
          <Route path="/commissionwrite" element={<commissionWrite />} />
          <Route path="/commissionlist" element={<commissionList />} />
          <Route path="/commissiondetail/:id" element={<commissionDetail />} />
          <Route path="/userorders" element={<UserOrders />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
