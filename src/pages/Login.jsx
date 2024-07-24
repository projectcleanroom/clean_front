import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import serverUrl from "../redux/config/serverUrl";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="email을 입력해주세요"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
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
