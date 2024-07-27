import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    __fetchcommission,
    __deletecommission,
} from '../redux/slices/commissionSlice';

const CommissionList = () => {
    const dispatch = useDispatch();
    const { commissions, isLoading, error } = useSelector(
        (state) => state.commission
    );
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        dispatch(__fetchcommission());
    }, [dispatch]);

    const handleDeletecommission = async (id) => {
        try {
            await dispatch(__deletecommission(id)).unwrap();
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
                    <li key={commission.id}>
                        <h2>{commission.title}</h2>
                        <p>{commission.body}</p>
                        <button
                            className="btn"
                            onClick={() => handleDeletecommission(commission.id)}
                        >
                            Delete
                        </button>
                        <Link to={`/commissiondetail/${commission.id}`}>
                            <button className="btn">Update</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommissionList;
