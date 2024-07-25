import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import serverUrl from '../redux/config/serverUrl';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const nav = useNavigate();

    const loginSubmit = async (e) => {
        e.preventDefault();
        try {
            // 모든 사용자 데이터를 가져옵니다.
            const response = await axios.get(`${serverUrl}/users`, {
                params: {
                    email,
                    password
                }
            });
    
            const users = response.data;
    
            // 입력한 이메일과 비밀번호가 일치하는 사용자가 있는지 확인합니다.
            const user = users.find(user => user.email === email && user.password === password);
    
            if (user) {
                // 사용자 인증 성공
                login(user.token, user.email);
                nav(`/`);
            } else {
                alert('로그인 실패: 잘못된 이메일 또는 비밀번호입니다.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 실패');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
            <div className="flex bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6 hidden sm:block">
                    <img
                        src={logo}
                        alt="깔끔한방 로고"
                        className="w-full h-auto max-h-[400px] object-contain"
                    />
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    <form onSubmit={loginSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1">이메일</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email을 입력해주세요"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력해주세요"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button className="btn" type="submit">
                                로그인
                            </button>
                            <button className="btn" onClick={() => nav(`/signup`)}>
                                회원가입
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
