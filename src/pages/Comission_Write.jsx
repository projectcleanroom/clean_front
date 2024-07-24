// src/components/ComissionWrite.js

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { __addComission } from '../redux/slices/comissionSlice';

const ComissionWrite = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newComission = { title, body };
        dispatch(__addComission(newComission));
        setTitle('');
        setBody('');
    };

    return (
        <div>
            <h1>Add New Comission</h1>
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
                    Add Comission
                </button>
            </form>
        </div>
    );
};

export default ComissionWrite;
