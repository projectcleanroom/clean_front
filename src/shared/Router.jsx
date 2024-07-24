import React, { useContext } from 'react';
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    Outlet,
} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Comission_Write from '../pages/Comission_Write';
import Comission_List from '../pages/Comission_List';
import Comission_Detail from '../pages/Comission_Detail';
import User_Orders from '../pages/User_Orders';
import MyPage from '../pages/MyPage';

const ProtectedRoute = () => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = () => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

const Router = () => {
    return (
        <BrowserRouter>
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
                        <Route path="/mypage" element={<MyPage />} />
                        <Route
                            path="/comissionwrite"
                            element={<Comission_Write />}
                        />
                        <Route
                            path="/comissionlist"
                            element={<Comission_List />}
                        />
                        <Route
                            path="/comissiondetail/:id"
                            element={<Comission_Detail />}
                        />
                        <Route path="/userorders" element={<User_Orders />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
