import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import partnerApi from '../api/partnerAxiosConfig';
import { Partner, PartnerLoginCredentials, PartnerLoginResponse } from '../types/partner';

// API 호출 함수들
export const fetchPartners = async (): Promise<Partner[]> => {
  const response = await partnerApi.get<Partner[]>('/partner');
  return response.data;
};

export const fetchCurrentPartner = async (): Promise<Partner> => {
  const response = await partnerApi.get<Partner>('/partner/profile');
  return response.data;
};

export const updatePartner = async (partner: Partial<Partner>): Promise<Partner> => {
  const response = await partnerApi.patch<Partner>(`/partner/${partner.email}`, partner);
  return response.data;
};

export const deletePartner = async (email: string): Promise<void> => {
  await partnerApi.delete(`/partner/${email}`);
};

export const partnerLogin = async (credentials: PartnerLoginCredentials): Promise<PartnerLoginResponse> => {
  const response = await partnerApi.post('/partner/login', credentials);

  const token = response.headers['authorization'];
  const refreshToken = response.headers['refresh-token'];

  if (!token || !refreshToken) {
    throw new Error('Token or refresh token not found in response headers');
  }

  return {
    token: token.replace('Bearer ', ''),
    refreshToken: refreshToken.replace('Bearer ', ''),
  };
};

export const partnerSignup = async (partner: Omit<Partner, 'id'> & { password: string }): Promise<Partner> => {
  const response = await partnerApi.post<Partner>('/partner/signup', partner);
  return response.data;
};

// React Query 훅들
export const usePartners = () => {
  return useQuery<Partner[], Error>({
    queryKey: ['partner'],
    queryFn: fetchPartners,
  });
};

export const useCurrentPartner = () => {
  return useQuery<Partner, Error>({
    queryKey: ['currentPartner'],
    queryFn: fetchCurrentPartner,
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation<Partner, Error, Partial<Partner>>({
    mutationFn: updatePartner,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentPartner'], data);
      queryClient.invalidateQueries({ queryKey: ['currentPartner'] });
    },
  });
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deletePartner,
    onSuccess: (_, email) => {
      queryClient.invalidateQueries({ queryKey: ['partner'] });
      queryClient.removeQueries({ queryKey: ['partner', email] });
    },
  });
};

export const usePartnerLogin = () => {
  return useMutation<PartnerLoginResponse, Error, PartnerLoginCredentials>({
    mutationFn: partnerLogin,
  });
};

export const usePartnerSignup = () => {
  return useMutation<Partner, Error, Omit<Partner, 'id'> & { password: string }>({
    mutationFn: partnerSignup,
  });
};
