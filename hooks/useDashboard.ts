import { useQuery } from "@tanstack/react-query";

import { apiList } from "@/lib/apiList";
import { getRequest } from "@/lib/apiService";

const DASHBOARD_QUERY_KEY = "dashboard-overview";

export const useDashboard = (days: number = 30) => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY, days],
    queryFn: () => getRequest(`${apiList.dashboard}?days=${days}`),
  });
};
