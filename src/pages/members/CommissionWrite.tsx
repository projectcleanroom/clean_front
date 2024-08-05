import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCommission } from '../../redux/slices/commissionSlice';
import { AppDispatch } from '../../redux/config/configStore';
import { useAuth } from '../../context/useAuth';

const CommissionWrite: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { authAxios } = useAuth();

  const [form, setForm] = useState({
    size: '',
    houseType: '',
    cleanType: '',
    addressId: '',
    image: '',
    desiredDate: '',
    significant: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newCommission = {
        size: Number(form.size),
        houseType: form.houseType,
        cleanType: form.cleanType,
        addressId: Number(form.addressId),
        image: form.image,
        desiredDate: new Date(form.desiredDate).toISOString(),
        significant: form.significant,
      };

      console.log('Sending commission data:', newCommission);
      console.log('Submitting commission:', form);
      const result = await dispatch(createCommission({ arg: newCommission, authAxios })).unwrap();
      console.log('Commission created:', result);
      navigate('/service');
    } catch (error: any) {
      console.error('Failed to create commission:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          아래 요구사항을 입력해주세요
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Size:</label>
            <input
              type="number"
              name="size"
              value={form.size}
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
              value={form.houseType}
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
              value={form.cleanType}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">AddressId:</label>
            <input
              type="text"
              name="addressId"
              value={form.addressId}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">image:</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Desired Date:</label>
            <input
              type="datetime-local"
              name="desiredDate"
              value={form.desiredDate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Significant:</label>
            <textarea
              name="significant"
              value={form.significant}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            className="w-full bg-[#0bb8f9] text-white py-2 px-4 rounded hover:bg-blue-600"
            type="submit"
          >
            의뢰 작성 완료하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommissionWrite;