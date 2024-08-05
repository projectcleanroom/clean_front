import { Commission } from '../types/commission';
import { Member } from '../types/member';
import api from './axiosConfig';
import { LoginCredentials, LoginResponse } from '../types/member';

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

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post('/api/members/login', credentials);
  
  const token = response.headers['authorization'];
  const refreshToken = response.headers['refresh-token'];

  if (!token || !refreshToken) {
    throw new Error('Token or refresh token not found in response headers');
  }

  return {
    token: token.replace('Bearer ', ''),
    refreshToken: refreshToken.replace('Bearer ', '')
  };
};

export const signup = async (
  member: Omit<Member, 'id'> & { password: string },
): Promise<Member> => {
  const response = await api.post<Member>('/members/signup', member);
  return response.data;
};

export const fetchCommission = async (id: number): Promise<Commission> => {
  const response = await api.get<Commission>(`/commission/${id}`);
  return response.data;
};

export const updateCommission = async (
  id: number,
  commission: Partial<Commission>,
): Promise<Commission> => {
  const response = await api.patch<Commission>(
    `/commissions/${id}`,
    commission,
  );
  return response.data;
};
