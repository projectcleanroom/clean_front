import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { __addCommission } from '../redux/slices/commissionSlice';
import { AppDispatch } from '../redux/config/configStore';
import { useNavigate } from 'react-router-dom';

interface CommissionWriteProps {}

const CommissionWrite: React.FC<CommissionWriteProps> = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const [commission, setCommission] = useState({
    size: 0,
    houseType: '',
    cleanType: '',
    desiredDate: '',
    significant: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCommission((prev) => ({
      ...prev,
      [name]: name === 'size' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCommission = {
      ...commission,
      membersId: 1,
      image: 'default_image',
      addressId: 1,
    };
    dispatch(__addCommission(newCommission));
    setCommission({
      size: 0,
      houseType: '',
      cleantype: '',
      desiredDate: '',
      significant: '',
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">아래 요구사항을 입력해주세요</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Size:</label>
            <input
              type="number"
              name="size"
              value={commission.size}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">House Type:</label>
            <input
              type="text"
              name="houseType"
              value={commission.houseType}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Clean Type:</label>
            <input
              type="text"
              name="cleanType"
              value={commission.cleanType}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Significant:</label>
            <textarea
              name="significant"
              value={commission.significant}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button onClick={() => navigate('/service')} className="w-full bg-[#0bb8f9] text-white py-2 px-4 rounded hover:bg-blue-600" type="submit">
            의뢰 작성 완료하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommissionWrite;
