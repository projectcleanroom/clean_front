import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import CommissionWrite from '../pages/CommissionWrite';
import CommissionList from '../pages/CommissionList';
import CommissionDetail from '../pages/CommissionDetail';
import UserOrders from '../pages/UserOrders';
import MyPage from '../pages/Mypage';
import Home from '../pages/Home';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* These routes were previously protected, but are now accessible to all */}
        <Route path="/mypage/:email" element={<MyPage />} />
        <Route path="/commissionwrite" element={<CommissionWrite />} />
        <Route path="/commissionlist" element={<CommissionList />} />
        <Route path="/commissiondetail/:id" element={<CommissionDetail />} />
        <Route path="/userorders" element={<UserOrders />} />
      </Route>
    </Routes>
  );
};

export default Router;