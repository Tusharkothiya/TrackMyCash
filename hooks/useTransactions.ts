import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiList } from "@/lib/apiList";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/apiService";
import { TOAST } from "@/lib/utils/toastMessage";
import type { TransactionFilters, TransactionPayload } from "@/features/transactions/types";

const TRANSACTION_QUERY_KEY = "transactions";

function buildTransactionQuery(filters?: TransactionFilters) {
  if (!filters) return "";

  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: [TRANSACTION_QUERY_KEY, filters || {}],
    queryFn: () => getRequest(`${apiList.transactions}${buildTransactionQuery(filters)}`),
  });
};

export const useTransactionById = (id: string | null) => {
  return useQuery({
    queryKey: [TRANSACTION_QUERY_KEY, "detail", id],
    queryFn: () => getRequest(apiList.transactionById(id as string)),
    enabled: Boolean(id),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransactionPayload) => postRequest(apiList.transactions, payload),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Transaction created successfully!");
        queryClient.invalidateQueries({ queryKey: [TRANSACTION_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        queryClient.invalidateQueries({ queryKey: ["budgets"] });
      }
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: {
      transactionId: string;
      payload: Partial<TransactionPayload>;
    }) => putRequest(apiList.transactionById(transactionId), payload),
    onSuccess: (response, variables) => {
      if (response?.success) {
        TOAST("success", response.message || "Transaction updated successfully!");
        queryClient.invalidateQueries({ queryKey: [TRANSACTION_QUERY_KEY] });
        queryClient.invalidateQueries({
          queryKey: [TRANSACTION_QUERY_KEY, "detail", variables.transactionId],
        });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        queryClient.invalidateQueries({ queryKey: ["budgets"] });
      }
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) => deleteRequest(apiList.transactionById(transactionId)),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Transaction deleted successfully!");
        queryClient.invalidateQueries({ queryKey: [TRANSACTION_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        queryClient.invalidateQueries({ queryKey: ["budgets"] });
      }
    },
  });
};
