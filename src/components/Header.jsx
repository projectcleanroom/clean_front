import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import icon from '../assets/icon.png'; // 로고 이미지 임포트

const Header = () => {
    const { isAuthenticated, logout, mypage } = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogout = () => {
        logout();
        nav(`/`);
    };

    const handleMypage = () => {
        nav(`/mypage`);
    };

    return (
        <div className="flex justify-between items-center p-4 bg-sky-500">
            <div>
                <img
                    src={icon}
                    alt="Home"
                    className="h-12 cursor-pointer" // 로고 크기 조절, 클릭 가능하게 설정
                    onClick={() => nav('/')} // 클릭 시 홈으로 이동
                />
            </div>
            <div>
                <button
                    className="h-btn"
                    onClick={() => nav('/Comissionwrite')}
                >
                    의뢰작성하기
                </button>
                <button className="h-btn" onClick={() => nav('/Comissionlist')}>
                    의뢰목록
                </button>
                <button className="h-btn" onClick={() => nav('/userorders')}>
                    견적확인하기
                </button>
            </div>

            <div>
                {isAuthenticated ? (
                    <>
                        <button onClick={handleMypage}>마이 페이지</button>
                        {' / '}
                        <button onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <button className="h-btn" onClick={() => nav('/login')}>
                            Log In
                        </button>
                        <button
                            className="h-btn"
                            onClick={() => nav('/signup')}
                        >
                            회원가입
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
