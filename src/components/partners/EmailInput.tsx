import { ChangeEvent, useState } from 'react';

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  setEmail,
}) => {
  const [localPart, setLocalPart] = useState('');
  const [domain, setDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  const commonDomains = [
    'gmail.com',
    'naver.com',
    'daum.net',
    'hanmail.net',
    'nate.com',
  ];

  const handleLocalPartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalPart(e.target.value);
    updateEmail(e.target.value, domain);
  };

  const handleDomainChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedDomain = e.target.value;
    setDomain(selectedDomain);
    if (selectedDomain === 'custom') {
      updateEmail(localPart, customDomain);
    } else {
      setCustomDomain('');
      updateEmail(localPart, selectedDomain);
    }
  };

  const handleCustomDomainChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomDomain(e.target.value);
    updateEmail(localPart, e.target.value);
  };

  const updateEmail = (local: string, dmn: string) => {
    const newEmail = local && dmn ? `${local}@${dmn}` : '';
    setEmail(newEmail);
  };

  return (
    <div>
      <label className="block mb-1">이메일</label>
      <div className="flex">
        <input
          type="text"
          value={localPart}
          onChange={handleLocalPartChange}
          placeholder="이메일 아이디"
          className="w-1/2 p-2 border border-gray-300 rounded-l"
        />
        <span className="p-2 bg-gray-100 border-t border-b">@</span>
        <select
          value={domain}
          onChange={handleDomainChange}
          className="w-1/2 p-2 border border-gray-300 rounded-r"
        >
          <option value="">선택해주세요</option>
          {commonDomains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
          <option value="custom">직접 입력</option>
        </select>
      </div>
      {domain === 'custom' && (
        <input
          type="text"
          value={customDomain}
          onChange={handleCustomDomainChange}
          placeholder="도메인을 입력해주세요"
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        />
      )}
    </div>
  );
};

export default EmailInput;