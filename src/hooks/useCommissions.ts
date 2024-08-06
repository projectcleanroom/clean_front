import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/commissions';
import { Commission } from '../types/commission';

export const useCommissions = () => {
  return useQuery<Commission[], Error>('commissions', api.fetchCommissions);
};

export const useCreateCommission = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Commission,
    Error,
    Omit<Commission, 'commissionId' | 'memberNick'>
  >({
    mutationFn: api.createCommission,
    onSuccess: (newCommission) => {
      queryClient.invalidateQueries(['commission']);
      queryClient.setQueryData(
        ['commission', newCommission.commissionId],
        newCommission,
      );
    },
  });
};

export const useDeleteCommission = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: api.deleteCommission,
    onSuccess: () => {
      queryClient.invalidateQueries(['commissions']);
    },
  });
};

export const useCommission = (id: number) => {
  return useQuery<Commission, Error>(['commission', id], () =>
    api.fetchCommission(id),
  );
};

export const useUpdateCommission = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Commission,
    Error,
    { id: number; commission: Partial<Commission> }
  >({
    mutationFn: ({ id, commission }) => api.updateCommission(id, commission),
    onSuccess: (updatedCommission) => {
      queryClient.setQueryData(
        ['commission', updatedCommission.commissionId],
        updatedCommission,
      );
      queryClient.invalidateQueries(['commissions']);
    },
  });
};
