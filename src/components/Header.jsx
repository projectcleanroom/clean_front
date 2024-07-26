import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import icon from "../assets/icon.png";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-brand text-white">
      <div>
        <img
          src={icon}
          alt="Home"
          className="h-12 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="flex space-x-4">
        <button className="h-btn" onClick={() => navigate("/Comissionwrite")}>
          의뢰작성하기
        </button>
        <button className="h-btn" onClick={() => navigate("/Comissionlist")}>
          의뢰목록
        </button>
        <button className="h-btn" onClick={() => navigate("/userorders")}>
          견적확인하기
        </button>
      </div>

      <div className="flex items-center">
        {isAuthenticated ? (
          <>
            <button className="h-btn" onClick={() => navigate("/mypage/:email")}>
              마이 페이지
            </button>
            <div className="w-px h-6 bg-white mx-2"></div>
            <button className="h-btn" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <button className="h-btn" onClick={() => navigate("/login")}>
              Log In
            </button>
            <div className="w-px h-6 bg-white mx-2"></div>
            <button className="h-btn" onClick={() => navigate("/signup")}>
              회원가입
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
