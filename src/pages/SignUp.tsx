import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import serverUrl from '../redux/config/serverUrl';
import logo from '../assets/logo.png';
import EmailInput from '../components/EmailInput';
import {
  validatePassword,
  validateNick,
  validatePhone_number,
} from '../utils/validationUtils';

interface User {
  email: string;
  password: string;
  nick: string;
  phone_number: string;
  token: string;
}

interface FormErrors {
  email: string;
  password: string;
  nick: string;
  phone_number: string;
}

const SignUp: React.FC = () => {
  const [formData, setformData] = useState<Omit<User, 'token'>>({
    email: '',
    password: '',
    nick: '',
    phone_number: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
    nick: '',
    phone_number: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));

    let errorMessage = '';
    switch (name) {
      case 'password':
        errorMessage = validatePassword(value);
        break;
      case 'nick':
        errorMessage = validateNick(value);
        break;
      case 'phone_number':
        errorMessage = validatePhone_number(value.replace(/[^0-9]/g, ''));
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const signUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      Object.values(formData).some((val) => !val) ||
      Object.values(errors).some((err) => err)
    ) {
      alert('입력한 정보를 다시 확인해주세요.');
      return;
    }
    try {
      // 이메일 중복 체크
      const existingUser = await axios.get<User[]>(
        `${serverUrl}/users?email=${formData.email}`,
      );
      if (existingUser.data.length > 0) {
        alert('이미 존재하는 이메일입니다.');
        return;
      }

      // 새 사용자 생성
      const response = await axios.post<User>(`${serverUrl}/users`, {
        ...formData,
        // JSON Server에서는 자동으로 id를 생성하지만, 토큰을 모방하기 위해 임의의 값을 생성합니다.
        token: Math.random().toString(36).substr(2, 9),
      });

      if (response.status === 201) {
        alert('회원가입 성공!');
        navigate(`/login`);
      } else {
        alert(`회원가입 실패: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`회원가입 에러`, error);
      alert(`회원가입 실패: ${error.response?.data?.message || error.message}`);
    }
  };

  const fieldLabels: { [key: string]: string } = {
    'password': '비밀번호',
    'nick': '닉네임',
    'phone_number': '전화번호'
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
              email={formData.email}
              setEmail={(email) => setformData((prev) => ({ ...prev, email }))}
              emailError={errors.email}
              setEmailError={(error) =>
                setErrors((prev) => ({ ...prev, email: error }))
              }
            />
            {['password', 'nick', 'phone_number'].map((field) => (
              <div key={field}>
                <label className="block mb-1">
                  {fieldLabels[field]}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  value={formData[field as keyof Omit<User, 'token' | 'email'>]}
                  onChange={handleChange}
                  placeholder={`${fieldLabels[field]}를 입력해주세요${field === 'phone_number' ? " ('-' 제외)" : ''}`}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors[field as keyof FormErrors] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field as keyof FormErrors]}
                  </p>
                )}
              </div>
            ))}
            <div className="flex space-x-4">
              <button
                className="btn hover:bg-blue-500 text-white py-2 px-4 rounded"
                type="submit"
              >
                회원가입하기
              </button>
              <button
                className="btn hover:bg-blue-500 text-white py-2 px-4 rounded"
                onClick={() => navigate(`/login`)}
                type="button"
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
