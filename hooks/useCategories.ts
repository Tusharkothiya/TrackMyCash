import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiList } from "@/lib/apiList";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/lib/apiService";
import { TOAST } from "@/lib/utils/toastMessage";
import type { CategoryPayload } from "@/features/categories/types";

const CATEGORY_QUERY_KEY = "categories";

export const useCategories = (type?: "expense" | "income") => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY, type || "all"],
    queryFn: () => {
      const query = type ? `?type=${type}` : "";
      return getRequest(`${apiList.categories}${query}`);
    },
  });
};

export const useCategoryById = (id: string | null) => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY, "detail", id],
    queryFn: () => getRequest(apiList.categoryById(id as string)),
    enabled: Boolean(id),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) => postRequest(apiList.categories, payload),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Category created successfully!");
        queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
      }
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: Partial<CategoryPayload>;
    }) => putRequest(apiList.categoryById(categoryId), payload),
    onSuccess: (response, variables) => {
      if (response?.success) {
        TOAST("success", response.message || "Category updated successfully!");
        queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
        queryClient.invalidateQueries({
          queryKey: [CATEGORY_QUERY_KEY, "detail", variables.categoryId],
        });
      }
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      deleteRequest(apiList.categoryById(categoryId)),
    onSuccess: (response) => {
      if (response?.success) {
        TOAST("success", response.message || "Category deleted successfully!");
        queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
      }
    },
  });
};
