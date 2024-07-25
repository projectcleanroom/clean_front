import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import serverUrl from "../redux/config/serverUrl";
import logo from "../assets/logo.png";
import EmailInput from "../components/EmailInput";
import {
  validatePassword,
  validateNickName,
  validatePhoneNumber,
} from "../utils/validationUtils";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const nav = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleNickNameChange = (e) => {
    const newNickName = e.target.value;
    setNickName(newNickName);
    setNickNameError(validateNickName(newNickName));
  };

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(newPhoneNumber);
    setPhoneNumberError(validatePhoneNumber(newPhoneNumber));
  };

  const signUpSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !nickName || !phoneNumber) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (emailError || passwordError || nickNameError || phoneNumberError) {
      alert("입력한 정보를 다시 확인해주세요.");
      return;
    }
    try {
      const response = await axios.post(`${serverUrl}/users`, {
        email,
        password,
        nickName,
        phoneNumber,
      });
      if (response.status === 201) {
        alert("회원가입 성공!");
        nav(`/login`);
      } else {
        alert(`회원가입 실패: ${response.data.message}`);
      }
    } catch (error) {
      console.error(`회원가입 에러`, error.message);
      alert(`회원가입 실패: ${error.response?.data?.message || error.message}`);
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
          <h2 className="text-2xl font-bold mb-4">회원가입</h2>
          <form onSubmit={signUpSubmit} className="space-y-4">
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
            <div>
              <label className="block mb-1">닉네임</label>
              <input
                type="text"
                value={nickName}
                onChange={handleNickNameChange}
                placeholder="닉네임을 입력해주세요"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {nickNameError && (
                <p className="text-red-500 text-sm mt-1">{nickNameError}</p>
              )}
            </div>
            <div>
              <label className="block mb-1">전화번호</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="전화번호를 입력해주세요 ('-' 제외)"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {phoneNumberError && (
                <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                회원가입하기
              </button>
              <button
                className="btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => nav(`/login`)}
              >
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
