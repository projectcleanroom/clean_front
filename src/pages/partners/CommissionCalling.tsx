import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import partnerApi from '../../api/partnerAxiosConfig';

const CommissionCalling: React.FC = () => {
  const [commissions, setCommissions] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const response = await partnerApi.get(`/commissions`, {
          params: { page, size: 10 },
        });
        setCommissions((prevCommissions) => [
          ...prevCommissions,
          ...response.data.content,
        ]);
        setHasMore(response.data.content.length > 0);
      } catch (err) {
        console.error('Error fetching commissions', err);
      }
    };

    fetchCommissions();
  }, [page]);

  const lastCommissionElementRef = (node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  const handleSelectCommission = (commissionId: number) => {
    navigate(`/commissionestimate/${commissionId}`);
  };

  return (
    <div>
      <h1>Commission Calling</h1>
      <div>
        {commissions.map((commission, index) => (
          <div
            key={commission.id}
            ref={commissions.length === index + 1 ? lastCommissionElementRef : null}
          >
            <p>{commission.description}</p>
            <button onClick={() => handleSelectCommission(commission.id)}>
              견적 작성
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommissionCalling;
