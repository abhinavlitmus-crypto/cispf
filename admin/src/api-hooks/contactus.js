import axios from "../utils/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "../constants/api-endpoints";

export const useContactListData = (
  qData = { page: 1, limit: 20 },
  options = {}
) => {
  const [queryParams, setQueryParams] = useState({ ...qData });
  const { ...all } = useQuery({
    queryKey: [API_ENDPOINTS.CONTACT_LIST, { ...queryParams, total: null }],
    queryFn: () =>
      axios.get(API_ENDPOINTS.CONTACT_LIST, { params: queryParams }),
    select: (res) => ({
      ...res,
      data: res.data.map((v) => ({
        key: v._id || v.key || v.code,
        ...v,
      })),
      qData: { ...queryParams, total: res.extra?.total },
      setQData: setQueryParams,
    }),
    // staleTime: 300000, // (30 * 60 * 1000)
    refetch: false,
    refetchOnWindowFocus: true,
    initialDataUpdatedAt: 0,
    initialData: () => ({ data: [], extra: {} }),
    ...options,
  });

  return {
    ...all,
    refetchWithQuery: (params) => {
      console.log(params);
      setQueryParams({ ...queryParams, ...params });
    },
  };
};
