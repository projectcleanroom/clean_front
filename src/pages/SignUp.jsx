import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import serverUrl from "../redux/config/serverUrl";
import logo from "../assets/logo.png";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const nav = useNavigate();

  const signUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(`${serverUrl}/users`, {
        email,
        password,
        nickName,
        phoneNumber,
      });
      console.log(data);
      if (data.status === 201) {
        nav(`/login`);
      } else {
        alert(`회원가입에 실패 했어요!`);
      }
    } catch (error) {
      console.error(`회원가입 에러`, error.message);
      alert(`회원가입에 실패 했어요! 다시 시도해주세요 :) `);
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
          <h2 className="text-2xl font-bold mb-4">SignUp</h2>
          <form onSubmit={signUpSubmit} className="space-y-4">
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
            <div>
              <label className="block mb-1">닉네임</label>
              <input
                type="text"
                value={nickName}
                onChange={(e) => {
                  setNickName(e.target.value);
                }}
                placeholder="닉네임을 입력해주세요"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">전화번호</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                placeholder="전화번호를 입력해주세요"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex space-x-4">
              <button className="btn" type="submit">
                회원가입하기
              </button>
              <button className="btn" onClick={() => nav(`/login`)}>
                로그인하러가기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
