import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_STATE_KEY} from "../constants/query.constants";
import {deleteState,listState,saveState } from "../handlers/state.handler";

export const useGetStateQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_STATE_KEY, { ...qData, total: null }],
        queryFn: () => listState(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useStateSaveMutation = () => useMutation({
    mutationFn: (data) => saveState(data)
})

export const useStateDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteState(data)
})