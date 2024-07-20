import styled from 'styled-components';

const Home = () => {
    return (
        <div>
            <StHeader>
                <div>
                    <h2>Home</h2>
                </div>
                <div>
                    <button>의뢰작성하기</button>
                    <button>의뢰목록</button>
                    <button>견적확인하기</button>
                </div>

                <div>
                    <button>로그인</button>
                    <button>회원가입</button>
                </div>
            </StHeader>
        </div>
    );
};

export default Home;

const StHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
