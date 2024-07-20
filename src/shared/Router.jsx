import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Comission_Write from '../pages/Comission_Write';
import Comission_List from '../pages/Comission_List';
import User_Orders from '../pages/User_Orders';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/comissionwrite" element={<Comission_Write />} />
                <Route path="/comissionlist" element={<Comission_List />} />
                <Route path="/userorders" element={<User_Orders />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
