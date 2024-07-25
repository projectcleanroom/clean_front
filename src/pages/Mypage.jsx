import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCurrentUser,
  updateUser,
  deleteUser,
  selectCurrentUser,
  selectUsersLoading,
  selectUsersError,
  clearCurrentUser,
} from "../redux/slices/usersSlice";
import { useAuth } from "../context/AuthContext";
import {
  validateNickName,
  validatePhoneNumber,
} from "../utils/validationUtils";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEmail, isAuthenticated, logout } = useAuth();
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  const [formData, setFormData] = useState({
    nickName: "",
    phoneNumber: "",
  });
  const [nickNameError, setNickNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !currentEmail) {
      navigate("/login");
    } else if (!currentUser) {
      dispatch(fetchCurrentUser(currentEmail));
    } else {
      setFormData({
        nickName: currentUser.nickName,
        phoneNumber: currentUser.phoneNumber,
      });
    }
  }, [dispatch, currentUser, currentEmail, isAuthenticated, navigate]);

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
    if (currentUser && currentUser.id) {
      const resultAction = await dispatch(
        updateUser({ id: currentUser.id, ...formData })
      );
      if (updateUser.fulfilled.match(resultAction)) {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        navigate("/");
      } else {
        alert("프로필 업데이트에 실패했습니다.");
      }
    } else {
      console.error("No current user ID found");
    }
  };

  const handleDelete = async () => {
    if (
      currentUser &&
      currentUser.id &&
      window.confirm(
        "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      const resultAction = await dispatch(deleteUser(currentUser.id));
      if (deleteUser.fulfilled.match(resultAction)) {
        dispatch(clearCurrentUser());
        logout();
        alert("계정이 성공적으로 삭제되었습니다.");
        navigate("/");
      } else {
        alert("계정 삭제에 실패했습니다.");
      }
    }
  };

  if (!currentEmail)
    return <div className="text-center mt-8">로그인이 필요합니다.</div>;
  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  if (!currentUser)
    return (
      <div className="text-center mt-8">사용자 정보를 불러올 수 없습니다.</div>
    );

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">내 정보</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1">이메일</label>
            <input
              type="text"
              name="email"
              value={currentEmail}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">닉네임</label>
            <input
              type="text"
              name="nickName"
              value={formData.nickName}
              onChange={handleInputChange}
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
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {phoneNumberError && (
              <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              프로필 업데이트
            </button>
            <button
              onClick={handleDelete}
              className="btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
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
