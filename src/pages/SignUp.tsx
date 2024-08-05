import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import EmailInput from '../components/EmailInput';
import { useSignup } from '../hooks/useMembers';
import { Member } from '../types/member';
import {
  validateNickName,
  validatePassword,
  validatePhoneNumber,
} from '../utils/validationUtils';

interface SignUpForm extends Omit<Member, 'id'> {
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
  nick: string;
  phoneNumber: string;
  general?: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpForm>({
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
  const signupMutation = useSignup();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let validationResult;
    switch (name) {
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'nick':
        validationResult = validateNickName(value);
        break;
      case 'phoneNumber':
        validationResult = validatePhoneNumber(value);
        break;
      default:
        return;
    }
    setErrors((prev) => ({ ...prev, [name]: validationResult.message }));
  };

  const signUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(errors).some((err) => err !== '')) {
      setErrors((prev) => ({
        ...prev,
        general: '입력한 정보를 다시 확인해주세요.',
      }));
      return;
    }

    try {
      await signupMutation.mutateAsync(formData);
      navigate(`/login`);
    } catch (error) {
      console.error('signup error:', error);
      setErrors((prev) => ({
        ...prev,
        general: '회원가입에 실패했습니다. 다시 시도해주세요.',
      }));
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
          {errors.general && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{errors.general}</span>
            </div>
          )}
          <form onSubmit={signUpSubmit} className="space-y-4">
            <EmailInput
              email={formData.email}
              setEmail={(email) => setFormData((prev) => ({ ...prev, email }))}
              emailError={errors.email}
              setEmailError={(error) =>
                setErrors((prev) => ({ ...prev, email: error }))
              }
            />
            {['password', 'nick', 'phoneNumber'].map((field) => (
              <div key={field}>
                <label className="block mb-1">
                  {field === 'password'
                    ? '비밀번호'
                    : field === 'nick'
                      ? '닉네임'
                      : '전화번호'}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  value={formData[field as keyof SignUpForm]}
                  onChange={handleChange}
                  placeholder={`${field === 'password' ? '비밀번호를 입력해주세요.' : field === 'nick' ? '닉네임을 입력해주세요.' : "전화번호를 입력해주세요('-' 제외)"}`}
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
