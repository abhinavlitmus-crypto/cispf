import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_PERMISSION_LIST } from "../constants/query.constants";
import { listPermission ,savePermission,deletePermission,approvePermission} from "../handlers/permission.handler";
import axios from "../utils/axios";

export const useGetPermissionQuery = (
  qData = {},
  options = {}
) => {
  const [queryParams, setQueryParams] = useState({ ...qData });

  const { ...all } = useQuery({
    queryKey: [QUERY_PERMISSION_LIST, { ...queryParams }],
    queryFn: () =>
      axios.get(`${QUERY_PERMISSION_LIST}/list`, {
        params: queryParams,
      }),
    select: (res) => ({
      ...res,
      data: res.data,
      qData: { ...queryParams },
      setQData: setQueryParams,
    }),
    enabled: Object.keys(queryParams).length > 0,
    refetchOnWindowFocus: false,
    initialData: () => ({ data: [] }),
    ...options,
  });

  return {
    ...all,
    refetchWithQuery: (params) => {
      setQueryParams((prev) => ({
        ...prev,
        ...params,
      }));
    },
  };
};



export const usePermissionSaveMutation = () => useMutation({
    mutationFn: (data) => savePermission(data)
})

export const usePermissionDeleteMutation = () => useMutation({
    mutationFn: (data) => deletePermission(data)
})

export const usePermissionApproveMutation = () => useMutation({
    mutationFn: (data) => approvePermission(data)
})