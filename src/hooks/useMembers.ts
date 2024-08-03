import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/members';

export const useMembers = () => {
  return useQuery(['members'], api.fetchMembers);
};

export const useCurrentMember = () => {
  return useQuery(['currentMember'], api.fetchCurrentMember);
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation(api.updateMember, {
    onSuccess: (updatedMember) => {
      queryClient.invalidateQueries(['members']);
      queryClient.invalidateQueries(['currentMember']);
      queryClient.setQueriesData(
        ['member', updatedMember.email],
        updatedMember,
      );
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation(api.deleteMember, {
    onSuccess: (_, email) => {
      queryClient.invalidateQueries(['members']);
      queryClient.invalidateQueries(['member', email]);
    },
  });
};

export const useLogin = () => {
  return useMutation(
    ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
  );
};

export const useSignup = () => {
  return useMutation(api.signup);
};
