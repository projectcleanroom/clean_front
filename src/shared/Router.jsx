import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Comission_Write from "../pages/Comission_Write";
import Comission_List from "../pages/Comission_List";
import Comission_Detail from "../pages/Comission_Detail";
import User_Orders from "../pages/User_Orders";
import MyPage from "../pages/Mypage";

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
          <Route path="/comissionwrite" element={<Comission_Write />} />
          <Route path="/comissionlist" element={<Comission_List />} />
          <Route path="/comissiondetail/:id" element={<Comission_Detail />} />
          <Route path="/userorders" element={<User_Orders />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
