import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as partner from '../api/partner'
import { Partner, PartnerLoginCredentials, PartnerLoginResponse } from '../types/partner';

export const usePartners = () => {
  return useQuery<Partner[], Error>({
    queryKey: ['partners'],
    queryFn: partner.fetchPartners,
  });
};

export const useCurrentPartner = () => {
  return useQuery<Partner, Error>({
    queryKey: ['currentPartner'],
    queryFn: partner.fetchCurrentPartner,
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation<Partner, Error, Partial<Partner>>({
    mutationFn: partner.updatePartner,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentPartner'], data);
      queryClient.invalidateQueries({ queryKey: ['currentPartner'] });
    },
  });
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: partner.deletePartner,
    onSuccess: (_, email) => {
      queryClient.invalidateQueries({ queryKey: ['partner'] });
      queryClient.removeQueries({ queryKey: ['partner', email] });
    },
  });
};

export const usePartnerLogin = () => {
  return useMutation<PartnerLoginResponse, Error, PartnerLoginCredentials>({
    mutationFn: partner.partnerLogin,
  });
};

export const usePartnerSignup = () => {
  return useMutation<Partner, Error, Omit<Partner, 'id'> & { password: string }>({
    mutationFn: partner.partnerSignup,
  });
};
