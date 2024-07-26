import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import serverUrl from "../redux/config/serverUrl";
import {
  validateNickName,
  validatePhoneNumber,
} from "../utils/validationUtils";

const MyPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nickName: "",
    phoneNumber: "",
  });
  const [nickNameError, setNickNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("인증 토큰이 없습니다.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${serverUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setCurrentUser(response.data);
        setFormData({
          nickName: response.data.nickName,
          phoneNumber: response.data.phoneNumber,
        });
      } else {
        setError("사용자 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("사용자 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchCurrentUser();
    }
  }, [isAuthenticated, navigate, fetchCurrentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "nickName") {
      setNickNameError(validateNickName(value));
    } else if (name === "phoneNumber") {
      setPhoneNumberError(validatePhoneNumber(value));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (nickNameError || phoneNumberError) {
      alert("입력한 정보를 다시 확인해주세요.");
      return;
    }
    try {
      const response = await axios.patch(
        `${serverUrl}/users/${currentUser.id}`,
        formData,
      );
      if (response.status === 200) {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        fetchCurrentUser(); // 업데이트된 정보를 다시 불러옵니다.
      } else {
        alert("프로필 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      )
    ) {
      try {
        const response = await axios.delete(
          `${serverUrl}/users/${currentUser.id}`,
        );
        if (response.status === 200) {
          logout();
          alert("계정이 성공적으로 삭제되었습니다.");
          navigate("/");
        } else {
          alert("계정 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("계정 삭제에 실패했습니다.");
      }
    }
  };

  if (isLoading) return <div className="mt-8 text-center">Loading...</div>;
  if (error)
    return <div className="mt-8 text-center text-red-500">Error: {error}</div>;
  if (!currentUser)
    return (
      <div className="mt-8 text-center">사용자 정보를 불러올 수 없습니다.</div>
    );

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">내 정보</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="mb-1 block">이메일</label>
            <input
              type="text"
              name="email"
              value={currentUser.email}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          <div>
            <label className="mb-1 block">닉네임</label>
            <input
              type="text"
              name="nickName"
              value={formData.nickName}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2"
            />
            {nickNameError && (
              <p className="mt-1 text-sm text-red-500">{nickNameError}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block">전화번호</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2"
            />
            {phoneNumberError && (
              <p className="mt-1 text-sm text-red-500">{phoneNumberError}</p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn rounded px-4 py-2 text-white hover:bg-blue-500"
            >
              프로필 업데이트
            </button>
            <button
              onClick={handleDelete}
              className="btn rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              계정 삭제
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPage;
