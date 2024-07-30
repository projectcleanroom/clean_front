import React, { useEffect, useState, useCallback, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import serverUrl from "../redux/config/serverUrl";
import {
  validateNick,
  validatePhone_number,
} from "../utils/validationUtils";

interface User {
  id: string;
  email: string;
  nick: string;
  phone_number: string;
}

interface FormData {
  nick: string;
  phone_number: string;
}

interface FormErrors {
  nick: string;
  phone_number: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nick: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    nick: "",
    phone_number: "",
  });

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("인증 토큰이 없습니다.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get<User>(`${serverUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setCurrentUser(response.data);
        setFormData({
          nick: response.data.nick,
          phone_number: response.data.phone_number,
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "nick") {
      setErrors(prev => ({ ...prev, nick: validateNick(value) }));
    } else if (name === "phone_number") {
      setErrors(prev => ({ ...prev, phone_number: validatePhone_number(value) }));
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errors.nick || errors.phone_number) {
      alert("입력한 정보를 다시 확인해주세요.");
      return;
    }
    try {
      const response = await axios.patch<User>(
        `${serverUrl}/users/${currentUser?.id}`,
        formData,
      );
      if (response.status === 200) {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        fetchCurrentUser();
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
          `${serverUrl}/users/${currentUser?.id}`,
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
              name="nick"
              value={formData.nick}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.nick && (
              <p className="mt-1 text-sm text-red-500">{errors.nick}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block">전화번호</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>
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
              type="button"
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