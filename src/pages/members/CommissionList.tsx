import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchCommissions,
  deleteCommission,
  selectAllCommissions,
  selectCommissionsLoading,
  selectCommissionsError
} from '../../redux/slices/commissionSlice';
import { AppDispatch } from '../../redux/config/configStore';
import { useAuth } from '../../context/useAuth';

const CommissionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { authAxios } = useAuth();
  const commissions = useSelector(selectAllCommissions);
  const isLoading = useSelector(selectCommissionsLoading);
  const error = useSelector(selectCommissionsError);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCommissions());
  }, [dispatch]);

  const handleDeleteCommission = async (id: number) => {
    try {
      await dispatch(deleteCommission(id)).unwrap();
      console.log(`Commission with id: ${id} deleted successfully`);
      setDeleteError(null);
    } catch (error) {
      console.error('Delete failed:', error);
      setDeleteError(`Failed to delete commission ${id}: ${error}`);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Commission List</h1>
      {deleteError && <p className="text-red-500 mb-4">{deleteError}</p>}
      <ul className="space-y-4">
        {commissions.map((commission) => (
          <li key={commission.commissionId} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold">Size: {commission.size}</h2>
            <p>House Type: {commission.houseType}</p>
            <p>Clean Type: {commission.cleanType}</p>
            <p>Desired Date: {new Date(commission.desiredDate).toLocaleString()}</p>
            <p>Significant: {commission.significant}</p>
            <div className="mt-4 space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDeleteCommission(commission.commissionId)}
              >
                Delete
              </button>
              <Link 
                to={`/commissiondetail/${commission.commissionId}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
              >
                Update
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommissionList;