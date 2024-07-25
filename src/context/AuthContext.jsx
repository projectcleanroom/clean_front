import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentEmail, setCurrentEmail] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const email = localStorage.getItem('email');

        setIsAuthenticated(!!accessToken);
        setCurrentEmail(email);
    }, []);

    const login = (token, email) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('email', email);
        setIsAuthenticated(true);
        setCurrentEmail(email);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');
        setIsAuthenticated(false);
        setCurrentEmail(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
