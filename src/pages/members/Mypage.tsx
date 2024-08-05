import React, {
  useEffect,
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import axios from 'axios';

interface Member {
  id: string;
  email: string;
  nick: string;
  phoneNumber: string;
}

interface FormData {
  nick: string;
  phoneNumber: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, authAxios } = useAuth();
  const [currentMenmber, setCurrentMenmber] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nick: '',
    phoneNumber: '',
  });

  const fetchCurrentMenmber = useCallback(async () => {
    try {
      const response = await axios.get<Member>(`/menmbers/me`);
      setCurrentMenmber(response.data);
      setFormData({
        nick: response.data.nick,
        phoneNumber: response.data.phoneNumber,
      });
    } catch (error) {
      console.error('Error fetching menmber data:', error);
      setError('사용자 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [authAxios]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchCurrentMenmber();
    }
  }, [isAuthenticated, navigate, fetchCurrentMenmber]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.patch<Member>(
        `/menmbers/${currentMenmber?.id}`,
        formData,
      );
      if (response.status === 200) {
        alert('프로필이 성공적으로 업데이트되었습니다.');
        fetchCurrentMenmber();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`프로필 업데이트 실패: ${error.response.data.message}`);
      } else {
        alert('프로필 업데이트에 실패했습니다.');
      }
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        '정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      )
    ) {
      try {
        const response = await axios.delete(
          `/menmbers/${currentMenmber?.id}`,
        );
        if (response.status === 200) {
          logout();
          alert('계정이 성공적으로 삭제되었습니다.');
          navigate('/');
        }
      } catch (error: any) {
        console.error('Error deleting account:', error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          alert(`계정 삭제 실패: ${error.response.data.message}`);
        } else {
          alert('계정 삭제에 실패했습니다.');
        }
      }
    }
  };

  if (isLoading) return <div className="mt-8 text-center">Loading...</div>;
  if (error)
    return <div className="mt-8 text-center text-red-500">Error: {error}</div>;
  if (!currentMenmber)
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
              value={currentMenmber.email}
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
            <label className="mb-1 block">전화번호</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2"
            />
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
