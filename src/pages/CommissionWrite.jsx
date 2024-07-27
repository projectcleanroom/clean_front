// src/components/commissionWrite.js

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { __addcommission } from '../redux/slices/commissionSlice';

const CommissionWrite = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newcommission = { title, body };
    dispatch(__addcommission(newcommission));
    setTitle('');
    setBody('');
  };

  return (
    <div>
      <h1>Add New Commission</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit">
          Add commission
        </button>
      </form>
    </div>
  );
};

export default CommissionWrite;
