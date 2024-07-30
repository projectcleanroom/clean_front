import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { __addCommission } from '../redux/slices/commissionSlice';
import { AppDispatch } from '../redux/config/configStore';

interface CommissionWriteProps {}

const CommissionWrite: React.FC<CommissionWriteProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [commission, setCommission] = useState({
    size: 0,
    houseType: '',
    cleantype: '',
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
      image: 'dafault_image',
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
    <div>
      <h1>Add New Commission</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Size:</label>
          <input
            type="number"
            name="size"
            value={commission.size}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>House Type:</label>
          <input
            type="text"
            name="houseType"
            value={commission.houseType}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Clean Type:</label>
          <input
            type="text"
            name="cleanType"
            value={commission.cleantype}
            onChange={handleChange}
            required
          />
          <div>
            <label>Significant:</label>
            <textarea
              name="significant"
              value={commission.significant}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button className="btn" type="submit">
          Add commission
        </button>
      </form>
    </div>
  );
};

export default CommissionWrite;
