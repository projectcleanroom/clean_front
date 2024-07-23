import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serverUrl from '../redux/config/serverUrl';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickName, setNickName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const nav = useNavigate();

    const signUpSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await axios.post(`${serverUrl}/users`, {
                email,
                password,
                nickName,
                phoneNumber,
            });
            console.log(data);
            if (data.status === 201) {
                nav(`/login`);
            } else {
                alert(`회원가입에 실패 했어요!`);
            }
        } catch (error) {
            console.error(`회원가입 에러`, error.message);
            alert(`회원가입에 실패 했어요! 다시 시도해주세요 :) `);
        }
    };

    return (
        <div>
            <div>
                <h2>SignUp</h2>
            </div>
            <form onSubmit={signUpSubmit}>
                <p>이메일</p>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    placeholder="email을 입력해주세요"
                />
                <p>비밀번호</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder="비밀번호를 입력해주세요"
                />
                <p>닉네임</p>
                <input
                    type="text"
                    value={nickName}
                    onChange={(e) => {
                        setNickName(e.target.value);
                    }}
                    placeholder="닉네임을 입력해주세요"
                />
                <p>전화번호</p>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => {
                        setPhoneNumber(e.target.value);
                    }}
                    placeholder="전화번호를 입력해주세요"
                />
                <br />
                <button type="submit">회원가입하기</button>
                <br />
                <button onClick={() => nav(`/login`)}>로그인하러가기</button>
            </form>
        </div>
    );
};

export default SignUp;
