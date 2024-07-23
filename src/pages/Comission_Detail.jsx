import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    __updateComission,
    __fetchComission,
} from '../redux/slices/comissionSlice';

const Comission_Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { comissions, isLoading, error } = useSelector(
        (state) => state.comission
    );
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedBody, setEditedBody] = useState('');
    const [updateError, setUpdateError] = useState(null);

    useEffect(() => {
        dispatch(__fetchComission());
    }, [dispatch]);

    const comission = comissions.find((c) => c.id === id);

    useEffect(() => {
        if (comission) {
            setEditedTitle(comission.title);
            setEditedBody(comission.body);
        }
    }, [comission]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateError(null);
        try {
            await dispatch(
                __updateComission({ id, title: editedTitle, body: editedBody })
            ).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error('Update failed:', error);
            setUpdateError(`Update failed: ${error}`);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!comission) return <p>Comission not found</p>;

    return (
        <div>
            <h1>Comission Detail</h1>
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
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                </form>
            ) : (
                <>
                    <h2>{comission.title}</h2>
                    <p>{comission.body}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </>
            )}
            <button onClick={() => navigate('/comissionlist')}>
                Back to List
            </button>
        </div>
    );
};

export default Comission_Detail;
