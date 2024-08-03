import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import logo from '../assets/logo.png';
import EmailInput from '../components/EmailInput';


interface Member {
  email: string;
  password: string;
  nick: string;
  phoneNumber: string;
  token: string;
}

interface FormErrors {
  email: string;
  password: string;
  nick: string;
  phoneNumber: string;
}

const SignUp: React.FC = () => {
  const [formData, setformData] = useState<Omit<Member, 'token'>>({
    email: '',
    password: '',
    nick: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
    nick: '',
    phoneNumber: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
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
      // 새 사용자 생성
      const response = await axios.post<Member>(
        `/api/members/signup`,
        formData,
      );
      if (response.status === 201) {
        alert('회원가입 성공!');
        navigate(`/login`);
      } else {
        alert(`회원가입 실패: ${response.statusText}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response) {
          // 서버에서 응답을 받았지만 2XX 범위가 아닌 상태 코드가 반환된 경우
          alert(
            `회원가입 실패: ${axiosError.response.data?.message || axiosError.message}`,
          );
        } else if (axiosError.request) {
          // 요청이 이루어졌으나 응답을 받지 못한 경우
          alert(`서버와의 통신에 실패했습니다. 네트워크 연결을 확인해주세요.`);
        } else {
          // 요청을 설정하는 중에 문제가 발생한 경우
          alert(`요청을 설정 중 오류가 발생했습니다: ${axiosError.message}`);
        }
      } else {
        // 예상치 못한 에러
        console.error(`unexpected error`, error);
        alert(`예상치 못한 오류가 발생했습니다.`);
      }
    }
  };

  const fieldLabels: { [key: string]: string } = {
    password: '비밀번호',
    nick: '닉네임',
    phoneNumber: '전화번호',
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
            {['password', 'nick', 'phoneNumber'].map((field) => (
              <div key={field}>
                <label className="block mb-1">{fieldLabels[field]}</label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  value={
                    formData[field as keyof Omit<Member, 'token' | 'email'>]
                  }
                  onChange={handleChange}
                  placeholder={`${fieldLabels[field]}를 입력해주세요${field === 'phoneNumber' ? " ('-' 제외)" : ''}`}
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
