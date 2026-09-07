import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_FOLLOW_LIST} from "../constants/query.constants";
import {deleteFollow,listFollow,saveFollow} from "../handlers/follow.handler";


export const useGetFollowQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_FOLLOW_LIST, { ...qData, total: null }],
        queryFn: () => listFollow(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useFollowSaveMutation = () => useMutation({
    mutationFn: (data) => saveFollow(data)
})

export const useFollowDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteFollow(data)
})