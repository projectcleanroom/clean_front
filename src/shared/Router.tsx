import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import MemberLayout from '../components/members/MemberLayout';
import PartnerLayout from '../components/partners/PartnerLayout';

import Home from '../pages/exclude/Home';
import ServicePage from '../pages/exclude/ServicePage';
import LoginSelector from '../pages/actionbutton/LoginSelector';
import SignUpSelector from '../pages/actionbutton/SignUpSelector';

import Login from '../pages/members/Login';
import SignUp from '../pages/members/SignUp';
import CommissionWrite from '../pages/members/CommissionWrite';
import CommissionList from '../pages/members/CommissionList';
import CommissionDetail from '../pages/members/CommissionDetail';
import UserOrders from '../pages/members/UserOrders';
import MemberInfo from '../pages/members/MemberInfo';
import MemberEdit from '../pages/members/MemberEdit';

import PartnerHome from '../pages/partners/PartnerHome';
import PartnerLogin from '../pages/partners/PartnerLogin';
import PartnerSignUp from '../pages/partners/PartnerSignUp';
import PartnerRecruitment from '../pages/exclude/PartnerRecruitment';
import CommissionCalling from '../pages/partners/CommissionCalling';
import CommissionMatching from '../pages/partners/CommissionMatching';
import CommissionEstimate from '../pages/partners/CommissionEsimate';
import MemberHome from '../pages/members/MemberHome';
import Layout from '../components/exclude/Layout';
import MyEstimates from '../pages/partners/MyEstimates';

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
      {/* exclude 레이아웃 */}
      <Route element={<Layout />}>
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
        <Route path="/partnerlogin" element={<PartnerLogin />} />
        <Route path="/partnersignup" element={<PartnerSignUp />} />
        </Route>        
      </Route>

      {/* 멤버 레이아웃 */}
      <Route element={<MemberLayout />}>
        {/* Protected Routes (for authenticated users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/memberhome" element={<MemberHome />} />          
          <Route path="/member/:email" element={<MemberInfo />} />
          <Route path="/member/:email/edit" element={<MemberEdit />} />
          <Route path="/commissionwrite" element={<CommissionWrite />} />
          <Route path="/commissionlist" element={<CommissionList />} />
          <Route path="/commissiondetail/:id" element={<CommissionDetail />} />
          <Route path="/userorders" element={<UserOrders />} />
        </Route>
      </Route>

      {/* 파트너 레이아웃 */}
      <Route element={<PartnerLayout />}>        
          <Route path="/partnerhome" element={<PartnerHome />} />
          <Route path="/commissioncalling" element={<CommissionCalling />} />
          <Route path="/commissionestimate" element={<CommissionEstimate />} />
          <Route path="/commissionmatching" element={<CommissionMatching />} />
          <Route path="/myestimates" element={<MyEstimates />} />
        {/* Public Only Routes (for non-authenticated users) */}
        <Route element={<PublicOnlyRoute />}>
        </Route>

        {/* Protected Routes (for authenticated users) */}
        <Route element={<ProtectedRoute />}>
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
