import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
  const nav = useNavigate();

  return (
    <StHeader>
      <div>
        <button onClick={() => nav("/")}>Home</button>
      </div>
      <div>
        <button onClick={() => nav("/Comissionwrite")}>의뢰작성하기</button>
        <button onClick={() => nav("/Comissionlist")}>의뢰목록</button>
        <button onClick={() => nav("/userorders")}>견적확인하기</button>
      </div>

      <div>
        <button onClick={() => nav("/login")}>로그인</button>
        <button onClick={() => nav("/signup")}>회원가입</button>
      </div>
    </StHeader>
  );
};

export default Header;

const StHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
