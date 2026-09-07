import axios from "../utils/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "../constants/api-endpoints";

export const useGetWebsiteData = (
  qData = { page: 1, limit: 20 },
  options = {}
) => {
  const [queryParams, setQueryParams] = useState({ ...qData });
  const { ...all } = useQuery({
    queryKey: [API_ENDPOINTS.WEB_PAGE_DETAILS, queryParams.type],
    queryFn: () =>
      axios.get(`${API_ENDPOINTS.WEB_PAGE_DETAILS}/${queryParams.type}`),
    select: (res) => ({
      ...res,
      data: [
        {
          ...res.data,
          key: res.data._id || res.data.key || res.data.code,
        },
      ],
      qData: { ...queryParams },
      setQData: setQueryParams,
    }),
    refetch: false,
    refetchOnWindowFocus: true,
    initialDataUpdatedAt: 0,
    initialData: () => ({ data: [], extra: {} }),
    ...options,
  });

  return {
    ...all,
    refetchWithQuery: (params) => {
      setQueryParams({ ...queryParams, ...params });
    },
  };
};

export const useWebsitePageSave = (
  { qData, onSuccess, onError },
  others = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axios.post(API_ENDPOINTS.WEB_PAGE_SAVE, data),
    onSuccess: (res) => {
      queryClient.setQueryData(
        [API_ENDPOINTS.WEB_PAGE_DETAILS, qData?.type],
        (old) => ({
          ...old,
          data: {
            ...res.data,
            key: res.data._id || res.data.key || res.data.code,
          },
          qData,
        })
      );

      if (typeof onSuccess === "function") {
        onSuccess(res);
      }
    },
    onError: (res) => {
      if (typeof onError === "function") {
        alert("eror ofcue shie");
        onError(res);
      }
    },
    ...others,
  });
};
