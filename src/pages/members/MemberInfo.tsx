import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentMember } from '../../hooks/useMembers';

const MemberInfo: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { data: member, isLoading, error } = useCurrentMember();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!member) return <div>회원 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">회원 정보</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            이메일
          </label>
          <p className="text-gray-700">{member.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            닉네임
          </label>
          <p className="text-gray-700">{member.nick}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            전화번호
          </label>
          <p className="text-gray-700">{member.phoneNumber}</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate(`/member/${email}/edit`)}
          >
            정보 수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberInfo;
