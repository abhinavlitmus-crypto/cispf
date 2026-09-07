
import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_ME} from "../constants/query.constants";
import {deleteMe,listMe,saveMe} from "../handlers/me.handler";



export const useGetMeQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_ME, { ...qData, total: null }],
        queryFn: () => listMe(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useMeSaveMutation = () => useMutation({
    mutationFn: (data) => saveMe(data)
})

export const useMeDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteMe(data)
})