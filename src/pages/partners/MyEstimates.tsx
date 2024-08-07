import React, { useEffect, useState } from 'react';
import partnerApi from '../../api/partnerAxiosConfig';
import ErrorNotification from '../../components/partners/ErrorNotification';

const MyEstimates: React.FC = () => {
  const [estimates, setEstimates] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        const response = await partnerApi.get(`/myestimates`);
        setEstimates(response.data);
      } catch (err) {
        setError('Error fetching estimates');
      }
    };

    fetchEstimates();
  }, []);

  const handleSendEstimate = async (estimateId: number) => {
    try {
      // 여기에 견적 보내기 API 호출 코드를 추가하세요
      await partnerApi.post(`/estimates/${estimateId}/send`);

      // 견적을 보낸 후 필요한 작업 추가
    } catch (err) {
      setError('Error sending estimate');
    }
  };

  return (
    <div>
      <h1>My Estimates</h1>
      {error && <ErrorNotification message={error} />}
      <div>
        {estimates.map((estimate) => (
          <div key={estimate.id}>
            <p>{estimate.content}</p>
            <button onClick={() => handleSendEstimate(estimate.id)}>
              견적 보내기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEstimates;
