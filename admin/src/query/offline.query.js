import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_OFFLINE_COACHING_LIST} from "../constants/query.constants";
import {saveofflineCoaching,listofflineCoaching,deleteofflineCoaching } from "../handlers/offline.handler";

export const useGetOfflineCoachingQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_OFFLINE_COACHING_LIST, { ...qData, total: null }],
        queryFn: () => listofflineCoaching(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useOfflineCoachingSaveMutation = () => useMutation({
    mutationFn: (data) => saveofflineCoaching(data)
})

export const useOfflineCoachingDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteofflineCoaching(data)
})