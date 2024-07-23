import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import serverUrl from '../redux/config/serverUrl';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useContext(AuthContext);
    const nav = useNavigate();

    const loginSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await axios.post(`${serverUrl}/users`, {
                email,
                password,
            });
            console.log(data);
            if (data.status === 201) {
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
                <p>이메일</p>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    placeholder="email을 입력해주세요"
                />
                <p>비밀번호</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder="비밀번호를 입력해주세요"
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
