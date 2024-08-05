import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Layout from '../components/members/Layout';
import Login from '../pages/members/Login';
import SignUp from '../pages/members/SignUp';
import CommissionWrite from '../pages/members/CommissionWrite';
import CommissionList from '../pages/members/CommissionList';
import CommissionDetail from '../pages/members/CommissionDetail';
import UserOrders from '../pages/members/UserOrders';
import MyPage from '../pages/members/Mypage';
import Home from '../pages/members/Home';
import ServicePage from '../pages/members/ServicePage';
import PartnerLogin from '../pages/partners/PartnerLogin';
import PartnerSignUp from '../pages/partners/PartnerSignUp';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/service" element={<ServicePage />} />

        {/* Public Only Routes (for non-authenticated users) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/partnerlogin" element={<PartnerLogin />} />
          <Route path="/partnersignup" element={<PartnerSignUp />} />
        </Route>

        {/* Protected Routes (for authenticated users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mypage/:email" element={<MyPage />} />
          <Route path="/commissionwrite" element={<CommissionWrite />} />
          <Route path="/commissionlist" element={<CommissionList />} />
          <Route path="/commissiondetail/:id" element={<CommissionDetail />} />
          <Route path="/userorders" element={<UserOrders />} />
        </Route>

        {/* Protected Routes (for authenticated users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mypage/:email" element={<MyPage />} />
          <Route path="/commissionwrite" element={<CommissionWrite />} />
          <Route path="/commissionlist" element={<CommissionList />} />
          <Route path="/commissiondetail/:id" element={<CommissionDetail />} />
          <Route path="/userorders" element={<UserOrders />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
