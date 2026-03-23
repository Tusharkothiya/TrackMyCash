import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../lib/apiService";
import { apiList } from "../lib/apiList";

export const useTestData = () => {
  return useQuery({
    queryKey: ["testData"],
    queryFn: () => getRequest(apiList.test),
  });
};
