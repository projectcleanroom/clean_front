import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    __updatecommission,
    __fetchcommission,
} from '../redux/slices/commissionSlice';

const CommissionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { commissions, isLoading, error } = useSelector(
        (state) => state.commission
    );
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedBody, setEditedBody] = useState('');
    const [updateError, setUpdateError] = useState(null);

    useEffect(() => {
        dispatch(__fetchcommission());
    }, [dispatch]);

    const commission = commissions.find((c) => c.id === id);

    useEffect(() => {
        if (commission) {
            setEditedTitle(commission.title);
            setEditedBody(commission.body);
        }
    }, [commission]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateError(null);
        try {
            await dispatch(
                __updatecommission({ id, title: editedTitle, body: editedBody })
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
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Body:</label>
                        <textarea
                            value={editedBody}
                            onChange={(e) => setEditedBody(e.target.value)}
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
                    <h2>{commission.title}</h2>
                    <p>{commission.body}</p>
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
