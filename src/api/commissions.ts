import api from './axiosConfig';
import { Commission } from '../types/commission';

export const createCommission = async (
  commission: Omit<Commission, 'commissionId' | 'memberNick'>,
): Promise<Commission> => {
  const response = await api.post<Commission>('/commissions', commission);
  return response.data;
};

export const fetchCommissions = async (): Promise<Commission[]> => {
  const response = await api.get<Commission[]>('/commissions');
  return response.data;
};

export const deleteCommission = async (id: number): Promise<void> => {
  await api.delete(`/commissions/${id}`);
};

export const fetchCommission = async (id: number): Promise<Commission> => {
  const response = await api.get<Commission>(`/commissions/${id}`);
  return response.data;
};