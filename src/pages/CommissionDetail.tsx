import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  __updateCommission,
  __fetchCommissions,
} from '../redux/slices/commissionSlice';
import { AppDispatch, RootState } from '../redux/config/configStore';

interface CommissionDetailProps {}

const CommissionDetail: React.FC<CommissionDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { commissions, isLoading, error } = useSelector(
    (state: RootState) => state.commission,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedCommission, setEditedCommission] = useState({
    size: 0,
    houseType: '',
    cleanType: '',
    desiredDate: '',
    significant: '',
  });
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(__fetchCommissions());
  }, [dispatch]);

  const commission = commissions.find((c) => c.commissionId === Number(id));

  useEffect(() => {
    if (commission) {
      setEditedCommission({
        size: commission.size,
        houseType: commission.houseType,
        cleanType: commission.cleanType,
        desiredDate: commission.desiredDate,
        significant: commission.significant,
      });
    }
  }, [commission]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    try {
      await dispatch(
        __updateCommission({
          commissionId: Number(id),
          ...editedCommission,
          membersId: 1,
          image: 'default_image',
          addressId: 1,
        }),
      ).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
      setUpdateError(`Update failed: ${error}`);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!commission) return <p>commission not found</p>;

  return (
    <div>
      <h1>commission Detail</h1>
      {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Title:</label>
            <input
              type="number"
              value={editedCommission.size}
              onChange={(e) =>
                setEditedCommission({
                  ...editedCommission,
                  size: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <label>House Type:</label>
            <input
              type="text"
              value={editedCommission.houseType}
              onChange={(e) =>
                setEditedCommission({
                  ...editedCommission,
                  size: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <label>Clean Type:</label>
            <input
              type="text"
              value={editedCommission.cleanType}
              onChange={(e) =>
                setEditedCommission({
                  ...editedCommission,
                  size: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <label>Desired Date:</label>
            <input
              type="datetime-local"
              value={editedCommission.desiredDate}
              onChange={(e) =>
                setEditedCommission({
                  ...editedCommission,
                  size: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <label>Significant:</label>
            <textarea
              value={editedCommission.significant}
              onChange={(e) =>
                setEditedCommission({
                  ...editedCommission,
                  size: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <button className="btn" type="submit">
            Save Changes
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h2>Size: {commission.size}</h2>
          <p>House Type: {commission.houseType}</p>
          <p>Clean Type: {commission.cleanType}</p>
          <p>Desired Date: {commission.desiredDate}</p>
          <p>Significant: {commission.significant}</p>
          <button className="btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </>
      )}
      <button className="btn" onClick={() => navigate('/commissionlist')}>
        Back to List
      </button>
    </div>
  );
};

export default CommissionDetail;
