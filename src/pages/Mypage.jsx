import React from 'react';

const MyPage = () => {
    return (
        <div>
            <h2>My Page</h2>
            <p>ID: {}</p>
            <p>닉네임: {}</p>
            <p>전화번호: {}</p>

            <form onSubmit={() => {}}>
                <input
                    type="text"
                    // value={}
                    onChange={(e) => {}}
                    placeholder="새 닉네임"
                />
                <button type="submit">닉네임 변경</button>
                <br />
                <input
                    type="text"
                    // value={}
                    onChange={(e) => {}}
                    placeholder="새로운 전화번호"
                />
                <button type="submit">전화번호 변경</button>
                <br />
                <input
                    type="password"
                    // value={}
                    onChange={(e) => {}}
                    placeholder="새로운 비밀번호 "
                />
                <button type="submit">비밀번호 변경</button>
            </form>
        </div>
    );
};

export default MyPage;
