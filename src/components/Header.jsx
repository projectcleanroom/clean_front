import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogout = () => {
        logout();
        nav(`/`);
    };

    return (
        <StHeader>
            <div>
                <button onClick={() => nav('/')}>Home</button>
            </div>
            <div>
                <button onClick={() => nav('/Comissionwrite')}>
                    의뢰작성하기
                </button>
                <button onClick={() => nav('/Comissionlist')}>의뢰목록</button>
                <button onClick={() => nav('/userorders')}>견적확인하기</button>
            </div>

            <div>
                {isAuthenticated ? (
                    <>
                        <button onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => nav('/login')}>Log In</button>
                        <button onClick={() => nav('/signup')}>회원가입</button>
                    </>
                )}
            </div>
        </StHeader>
    );
};

export default Header;

const StHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed; /* 헤더를 고정합니다 */
    top: 0; /* 상단에 위치시킵니다 */
    left: 0; /* 좌측에 위치시킵니다 */
    width: 100%; /* 화면 전체 너비를 차지합니다 */
    background-color: #2d3748; /* 배경색을 설정합니다 */
    color: white; /* 텍스트 색상을 설정합니다 */
    padding: 1rem; /* 패딩을 추가하여 내부 여백을 만듭니다 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과를 추가합니다 */
    z-index: 1000; /* 다른 요소보다 위에 위치하도록 z-index를 설정합니다 */
`;
