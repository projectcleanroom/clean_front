import { AuthProvider } from './context/AuthContext';
import Router from './shared/Router';
import '../src/App.css';

const App = () => {
    return (
        <AuthProvider>
            <Router />
        </AuthProvider>
    );
};

export default App;
