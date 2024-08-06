import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import logo from '../../assets/logo.png';
import EmailInput from '../../components/members/EmailInput';
import axios from 'axios';

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

const PartnerLogin: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    if (errors.email || errors.password) {
      alert('입력한 정보를 다시 확인해주세요.');
      return;
    }
    try {
      const response = await axios.post(
        `/api/members/login`,
        formData,
        { withCredentials: true },
      );

      const token = response.headers['authorization'].split(' ')[1];
      const refreshToken = response.headers['refresh-token'].split(' ')[1];

      if (token && refreshToken) {
        login(token, refreshToken);
        navigate('/');
      } else {
        alert('로그인 실패: 잘못된 이메일 또는 비밀번호입니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('로그인 오류', error.response?.data);
        alert(`로그인 실패${error.response?.data?.message || error.message}`);
      } else {
        console.error('예상치 못한 오류:', error);
        alert('로그인 중 예상치 못한 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
      <div className="grid bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 hidden sm:block">
          <img
            src={logo}
            alt="깔끔한방 로고"
            className="w-full h-auto max-h-[300px] object-contain"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">로그인</h2>
          <form onSubmit={loginSubmit} className="space-y-4">
            <EmailInput
              email={formData.email}
              setEmail={(email) => setFormData((prev) => ({ ...prev, email }))}
              emailError={errors.email}
              setEmailError={(error) =>
                setErrors((prev) => ({ ...prev, email: error }))
              }
            />
            <div>
              <label className="block mb-1">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-[#144156] text-white py-2 px-4 rounded"
                type="submit"
              >
                로그인
              </button>
              <button
                className="bg-[#144156] text-white py-2 px-4 rounded"
                onClick={() => navigate('/partnersignup')}
                type="button"
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

export default PartnerLogin;
