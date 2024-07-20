import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
  //   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const nav = useNavigate();

  //   useEffect =
  //     (() => {
  //       const accessToken = cookie.get("accessToken");
  //       setIsLoggedIn(!!accessToken);
  //     },
  //     []);

  const handleAuthAction = () => {};

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
        <button
          // onClick={handleAuthAction}
          onClick={() => nav("/login")}
        >
          {/* {isLoggedIn ? "Log Out" : "Log In"} */}
          로그인
        </button>
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
