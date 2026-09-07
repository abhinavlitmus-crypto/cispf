import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_ONLINE_COACHING_LIST} from "../constants/query.constants";
import {deleteOnlineCoaching,listOnlineCoaching,saveOnlineCoaching } from "../handlers/online.handler";

export const useGetOnlineCoachingQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_ONLINE_COACHING_LIST, { ...qData, total: null }],
        queryFn: () => listOnlineCoaching(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useOnlineCoachingSaveMutation = () => useMutation({
    mutationFn: (data) => saveOnlineCoaching(data)
})

export const useOnlineCoachingDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteOnlineCoaching(data)
})