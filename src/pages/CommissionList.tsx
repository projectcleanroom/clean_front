import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  __fetchCommissions,
  __deleteCommission,
} from '../redux/slices/commissionSlice';
import { AppDispatch, RootState } from '../redux/config/configStore';

interface CommissionListProps {}

const CommissionList: React.FC<CommissionListProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { commissions, isLoading, error } = useSelector(
    (state: RootState) => state.commission,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(__fetchCommissions());
  }, [dispatch]);

  const handleDeletecommission = async (id: number) => {
    try {
      await dispatch(__deleteCommission(id)).unwrap();
      console.log(`commission with id: ${id} deleted successfully`);
    } catch (error) {
      console.error('Delete failed:', error);
      setDeleteError(`Failed to delete commission ${id}: ${error}`);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>commission List</h1>
      {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
      <ul>
        {commissions.map((commission) => (
          <li key={commission.commissionId}>
            <h2>size: {commission.size}</h2>
            <p>House Type: {commission.houseType}</p>
            <p>Clean Type: {commission.cleanType}</p>
            <p>Desired Date: {commission.desiredDate}</p>
            <p>Significant: {commission.significant}</p>
            <button
              className="btn"
              onClick={() => handleDeletecommission(commission.commissionId)}
            >
              Delete
            </button>
            <Link to={`/commissiondetail/${commission.commissionId}`}>
              <button className="btn">Update</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommissionList;
