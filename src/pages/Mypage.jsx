import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser, updateUser, deleteUser, selectCurrentUser, selectUsersLoading, selectUsersError } from '../redux/slices/usersSlice';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentEmail, isAuthenticated } = useAuth();
    const currentUser = useSelector(selectCurrentUser);
    const isLoading = useSelector(selectUsersLoading);
    const error = useSelector(selectUsersError);

    const [formData, setFormData] = useState({
        nickName: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (!isAuthenticated || !currentEmail) {
            navigate('/login');
        } else if (!currentUser) {
            dispatch(fetchCurrentUser(currentEmail));
        } else {
            setFormData({
                nickName: currentUser.nickName,
                phoneNumber: currentUser.phoneNumber
            });
        }
    }, [dispatch, currentUser, currentEmail, isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (currentEmail) {
            dispatch(updateUser({ email: currentEmail, nickName: formData.nickName, phoneNumber: formData.phoneNumber }));
        } else {
            console.error('No current email found');
        }
    };

    const handleDelete = () => {
        if (currentEmail && window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            dispatch(deleteUser(currentEmail));
            // 여기에 로그아웃 및 홈페이지로 리다이렉트 로직 추가
        }
    };

    if (!currentEmail) return <div>로그인이 필요합니다.</div>;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!currentUser) return <div>사용자 정보를 불러올 수 없습니다.</div>;

    return (
        <div>
            <h1>My Page</h1>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>이메일</label>
                    <input type="text" name="email" value={currentEmail} disabled />
                </div>
                <div>
                    <label>닉네임</label>
                    <input type="text" name="nickName" value={formData.nickName} onChange={handleInputChange} />
                </div>
                <div>
                    <label>전화번호</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
            <button onClick={handleDelete}>Delete Account</button>
        </div>
    );
};

export default MyPage;
