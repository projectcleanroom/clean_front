import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import serverUrl from "../redux/config/serverUrl";
import logo from "../assets/logo.png";
import EmailInput from "../components/EmailInput";
import { validatePassword } from "../utils/validationUtils";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (emailError || passwordError) {
      alert("입력한 정보를 다시 확인해주세요.");
      return;
    }
    try {
      const response = await axios.get(
        `${serverUrl}/users?email=${email}&password=${password}`
      );
      if (response.data.length > 0) {
        // JSON Server doesn't provide tokens, so we'll use the user's id as a mock token
        const mockToken = response.data.email;
        login(mockToken);
        navigate(`/`);
      } else {
        alert("로그인 실패: 잘못된 이메일 또는 비밀번호입니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 실패");
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
          <h2 className="text-2xl font-bold mb-4">로그인</h2>
          <form onSubmit={loginSubmit} className="space-y-4">
            <EmailInput
              email={email}
              setEmail={setEmail}
              emailError={emailError}
              setEmailError={setEmailError}
            />
            <div>
              <label className="block mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력해주세요"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                className="btn hover:bg-blue-500 text-white py-2 px-4 rounded"
                type="submit"
              >
                로그인
              </button>
              <button
                className="btn hover:bg-blue-500 text-white py-2 px-4 rounded"
                onClick={() => navigate(`/signup`)}
              >
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
