import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentMember, useUpdateMember } from '../hooks/useMembers';
import {
  validateNickName,
  validatePhoneNumber,
} from '../utils/validationUtils';
import { FormEvent, useState } from 'react';

interface FormErrors {
  nick: string;
  phoneNumber: string;
  general?: string;
}

const MemberEdit: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { data: member, isLoading, error } = useCurrentMember();
  const updateMemberMutation = useUpdateMember();

  const [formData, setFormData] = useState({
    nick: member?.nick || '',
    phoneNumber: member?.phoneNumber || '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    nick: '',
    phoneNumber: '',
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!member) return <div>회원 정보를 찾을 수 없습니다.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let validationResult;
    if (name === 'nick') {
      validationResult = validateNickName(value);
    } else if (name === 'phoneNumber') {
      validationResult = validatePhoneNumber(value);
    }

    if (validationResult) {
      setErrors((prev) => ({ ...prev, [name]: validationResult.message }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (errors.nick || errors.phoneNumber) {
      setErrors((prev) => ({
        ...prev,
        general: '입력한 정보를 다시 확인해주세요.',
      }));
      return;
    }

    try {
      await updateMemberMutation.mutateAsync({ ...formData, email });
      navigate(`/member/${email}`);
    } catch (error) {
      console.error('Update Error:', error);
      setErrors((prev) => ({
        ...prev,
        general: '회원 정보 수정에 실패했습니다.',
      }));
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">회원 정보 수정</h2>
      {errors.general && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{errors.general}</span>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            이메일
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            disabled
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nick"
          >
            닉네임
          </label>
          <input
            className={`shadow appearance-none border ${errors.nick ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="nick"
            type="text"
            name="nick"
            value={formData.nick}
            onChange={handleChange}
          />
          {errors.nick && (
            <p className="text-red-500 text-xs italic">{errors.nick}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            전화번호
          </label>
          <input
            className={`shadow appearance-none border ${errors.phoneNumber ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs italic">{errors.phoneNumber}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            수정 완료
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate(`/member/${email}`)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberEdit;
