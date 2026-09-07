import axios from "../utils/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "../constants/api-endpoints";

export const usePlanListData = (
  qData = { page: 1, limit: 20 },
  options = {}
) => {
   
  const [queryParams, setQueryParams] = useState({ ...qData });
  const { ...all } = useQuery({
    queryKey: [API_ENDPOINTS.PLAN_LIST, { ...queryParams, total: null }],
    queryFn: () =>
      axios.get(API_ENDPOINTS.PLAN_LIST, { params: queryParams }),
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
      setQueryParams({ ...queryParams, ...params });
    },
  };
};
export const usePlanSave = (
  { qData = { page: 1, limit: 20 }, onSuccess, onError, editted },
  others = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axios.post(API_ENDPOINTS.PLAN_SAVE, data),
    onSuccess: (res) => {
      queryClient.setQueryData(
        [API_ENDPOINTS.PLAN_LIST, { ...qData, total: null }],
        (old) =>
          old && {
            ...old,
            data: (old.data.find((v) => v._id === res.data._id)
              ? old.data.map((v) => (v._id === res.data._id ? res.data : v))
              : [res.data, ...old.data]
            ).sort((a, b) => a.index - b.index),
          }
      );
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(res);
      }
    },
    onError: (res) => {
      if (onError && typeof onError === "function") {
        onError(res);
      }
    },
    ...others,
  });
};

export const usePlanDelete = (
  { qData = { page: 1, limit: 20 }, onSuccess, onError },
  others = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.post(API_ENDPOINTS.PLAN_DELETE, data),
    onSuccess: (res) => {
      queryClient.setQueryData(
        [API_ENDPOINTS.PLAN_LIST, { ...qData, total: null }],
        (old) =>
          old && {
            ...old,
            data: [...old.data.filter((v) => v._id !== res.data._id)],
          }
      );
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(res);
      }
    },
    onError: (res) => {
      if (onError && typeof onError === "function") {
        onError(res);
      }
    },
    ...others,
  });
};