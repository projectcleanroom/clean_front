import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const nav = useNavigate();

    const loginSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                'https://moneyfulpublicpolicy.co.kr/login',
                { id, password }
            );
            if (data.success) {
                login(data.success);
                nav(`/`);
            } else {
                alert(`login failed`);
            }
        } catch (error) {
            console.error(`Login error :`, error);
            alert(`Login failed`);
        }
    };
    return (
        <div>
            <div>
                <h2>Login</h2>
            </div>
            <form onSubmit={loginSubmit}>
                <p>login</p>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => {
                        setId(e.target.value);
                    }}
                    placeholder="ID를 입력해주세요"
                />
                <p>password</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder="password를 입력해주세요"
                />
                <br />
                <button type="submit">로그인</button>
                <br />

                <button onClick={() => nav(`/signup`)}>회원가입</button>
            </form>
        </div>
    );
};

export default Login;
