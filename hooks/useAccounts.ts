import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiList } from "@/lib/apiList";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/lib/apiService";
import { TOAST } from "@/lib/utils/toastMessage";
import type { AccountPayload } from "@/features/accounts/types";

const ACCOUNT_QUERY_KEY = "accounts";

export const useAccounts = () => {
  return useQuery({
    queryKey: [ACCOUNT_QUERY_KEY],
    queryFn: () => getRequest(apiList.accounts),
  });
};

export const useAccountById = (id: string | null) => {
  return useQuery({
    queryKey: [ACCOUNT_QUERY_KEY, "detail", id],
    queryFn: () => getRequest(apiList.accountById(id as string)),
    enabled: Boolean(id),
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AccountPayload) =>
      postRequest(apiList.accounts, payload),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Account created successfully!");
        queryClient.invalidateQueries({ queryKey: [ACCOUNT_QUERY_KEY] });
      }
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: string;
      payload: Partial<AccountPayload>;
    }) => putRequest(apiList.accountById(accountId), payload),
    onSuccess: (response, variables) => {
      if (response?.success) {
        TOAST("success", response.message || "Account updated successfully!");
        queryClient.invalidateQueries({ queryKey: [ACCOUNT_QUERY_KEY] });
        queryClient.invalidateQueries({
          queryKey: [ACCOUNT_QUERY_KEY, "detail", variables.accountId],
        });
      }
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) =>
      deleteRequest(apiList.accountById(accountId)),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Account deleted successfully!");
        queryClient.invalidateQueries({ queryKey: [ACCOUNT_QUERY_KEY] });
      }
    },
  });
};
