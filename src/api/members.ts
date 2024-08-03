import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface Member {
  email: string;
  nick: string;
  phoneNumber: string;
}

export const fetchMembers = async (): Promise<Member[]> => {
  const response = await api.get<Member[]>('/members');
  return response.data;
};

export const fetchCurrentMember = async (): Promise<Member> => {
  const response = await api.get<Member>('/members/me');
  return response.data;
};

export const updateMember = async (
  member: Partial<Member>,
): Promise<Member> => {
  const response = await api.patch<Member>(`/members/${member.email}`, member);
  return response.data;
};

export const deleteMember = async (email: string): Promise<void> => {
  await api.delete(`/members/${email}`);
};

export const login = async (
  email: string,
  password: string,
): Promise<{ token: string; refreshToken: string }> => {
  const response = await api.post<{ token: string; refreshToken: string }>(
    '/members/login',
    { email, password },
  );
  return response.data;
};

export const signup = async (
  member: Member & { password: string },
): Promise<Member> => {
  const response = await api.post<Member>('members/signup', member);
  return response.data;
};
