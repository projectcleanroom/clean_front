import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

import MemberLayout from '../components/members/MemberLayout';
import PartnerLayout from '../components/partners/PartnerLayout';

import Login from '../pages/members/Login';
import SignUp from '../pages/members/SignUp';
import CommissionWrite from '../pages/members/CommissionWrite';
import CommissionList from '../pages/members/CommissionList';
import CommissionDetail from '../pages/members/CommissionDetail';
import UserOrders from '../pages/members/UserOrders';
import MemberInfo from '../pages/members/MemberInfo';
import MemberEdit from '../pages/members/MemberEdit';
import Home from '../pages/members/Home';
import ServicePage from '../pages/members/ServicePage';
import PartnerLogin from '../pages/partners/PartnerLogin';
import PartnerSignUp from '../pages/partners/PartnerSignUp';
import LoginSelector from '../pages/actionbutton/LoginSelector';
import SignUpSelector from '../pages/actionbutton/SignUpSelector';
import PartnerRecruitment from '../pages/partners/PartnerRecruitment';
import PartnerHome from '../pages/partners/PartnerHome';
import CommissionCalling from '../pages/partners/CommissionCalling';
import CommissionEsimate from '../pages/partners/CommissionEsimate';
import CommissionMatching from '../pages/partners/CommissionMatching';


const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/loginselect" replace />;
};

const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<MemberLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/partnerrecruitment" element={<PartnerRecruitment />} />
        <Route path="/loginselect" element={<LoginSelector />} />
        <Route path="/signupselect" element={<SignUpSelector />} />

        {/* Public Only Routes (for non-authenticated users) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Protected Routes (for authenticated users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/member/:email" element={<MemberInfo />} />
          <Route path="/member/:email/edit" element={<MemberEdit />} />
          <Route path="/commissionwrite" element={<CommissionWrite />} />
          <Route path="/commissionlist" element={<CommissionList />} />
          <Route path="/commissiondetail/:id" element={<CommissionDetail />} />
          <Route path="/userorders" element={<UserOrders />} />
        </Route>
      </Route>
      <Route element={<PartnerLayout />}>
        {/* Public Routes */}
        <Route path="/partnerhome" element={<PartnerHome />} />
        <Route path="/partnerrecruitment" element={<PartnerRecruitment />} />
        <Route path="/commissioncalling" element={<CommissionCalling />} />
        <Route path="/commissionestimate" element={<CommissionEsimate />} />
        <Route path="/commissionmatching" element={<CommissionMatching />} />

        {/* Public Only Routes (for non-authenticated users) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/partnerlogin" element={<PartnerLogin />} />
          <Route path="/partnersignup" element={<PartnerSignUp />} />
        </Route>

        {/* Protected Routes (for authenticated users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/member/:email" element={<MemberInfo />} />
          <Route path="/member/:email/edit" element={<MemberEdit />} />
          <Route path="/userorders" element={<UserOrders />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
