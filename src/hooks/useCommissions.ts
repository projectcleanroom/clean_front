import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import * as api from '../api/commissions';
import { Commission } from '../types/commission';

export const useCommissions = () => {
  return useQuery({
    queryKey: ['commission'],
    queryFn: api.fetchCommissions,
  });
};

export const useCreateCommission = (): UseMutationResult<
  Commission,
  Error,
  Omit<Commission, 'commissionId' | 'memberNick'>,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCommission,
    onSuccess: (newCommission) => {
      queryClient.invalidateQueries({ queryKey: ['commission'] });
      queryClient.setQueryData(
        ['commission', newCommission.commissionId],
        newCommission,
      );
    },
  });
};

export const useDeleteCommission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
};

export const useCommission = (id: number) => {
  return useQuery({
    queryKey: ['commission', id],
    queryFn: api.fetchCommission(id),
  });
};

export const useUpdateCommission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      commission,
    }: {
      id: number;
      commission: Partial<Commission>;
    }) => api.updateCommission(id, commission),
    onSuccess: (updatedCommission) => {
      queryClient.setQueryData(
        ['commission', updatedCommission.commissionId],
        updatedCommission,
      );
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
};
