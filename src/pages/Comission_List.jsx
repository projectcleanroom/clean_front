import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    __fetchComission,
    __deleteComission,
} from '../redux/slices/comissionSlice';

const ComissionList = () => {
    const dispatch = useDispatch();
    const { comissions, isLoading, error } = useSelector(
        (state) => state.comission
    );
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        dispatch(__fetchComission());
    }, [dispatch]);

    const handleDeleteComission = async (id) => {
        try {
            await dispatch(__deleteComission(id)).unwrap();
            console.log(`Comission with id: ${id} deleted successfully`);
        } catch (error) {
            console.error('Delete failed:', error);
            setDeleteError(`Failed to delete comission ${id}: ${error}`);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Comission List</h1>
            {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
            <ul>
                {comissions.map((comission) => (
                    <li key={comission.id}>
                        <h2>{comission.title}</h2>
                        <p>{comission.body}</p>
                        <button
                            className="btn"
                            onClick={() => handleDeleteComission(comission.id)}
                        >
                            Delete
                        </button>
                        <Link to={`/comissiondetail/${comission.id}`}>
                            <button className="btn">Update</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ComissionList;
