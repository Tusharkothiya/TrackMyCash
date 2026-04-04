import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiList } from "@/lib/apiList";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/lib/apiService";
import { TOAST } from "@/lib/utils/toastMessage";
import type { BudgetPayload } from "@/features/budgets/types";

const BUDGET_QUERY_KEY = "budgets";

export const useBudgets = () => {
  return useQuery({
    queryKey: [BUDGET_QUERY_KEY],
    queryFn: () => getRequest(apiList.budgets),
  });
};

export const useBudgetById = (id: string | null) => {
  return useQuery({
    queryKey: [BUDGET_QUERY_KEY, "detail", id],
    queryFn: () => getRequest(apiList.budgetById(id as string)),
    enabled: Boolean(id),
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BudgetPayload) =>
      postRequest(apiList.budgets, payload),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Budget created successfully!");
        queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] });
      }
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      payload,
    }: {
      budgetId: string;
      payload: Partial<BudgetPayload>;
    }) => putRequest(apiList.budgetById(budgetId), payload),
    onSuccess: (response, variables) => {
      if (response?.success) {
        TOAST("success", response.message || "Budget updated successfully!");
        queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] });
        queryClient.invalidateQueries({
          queryKey: [BUDGET_QUERY_KEY, "detail", variables.budgetId],
        });
      }
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (budgetId: string) =>
      deleteRequest(apiList.budgetById(budgetId)),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Budget deleted successfully!");
        queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] });
      }
    },
  });
};
