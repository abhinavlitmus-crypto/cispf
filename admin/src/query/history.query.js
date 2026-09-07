import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_HISTORY_LIST} from "../constants/query.constants";
import {listHistory} from "../handlers/history.handler";



export const useGetHistoryQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_HISTORY_LIST, { ...qData, total: null }],
        queryFn: () => listHistory(qData),
        keepPreviousData: true,
        retry: 3
    });
}

// export const useClientSaveMutation = () => useMutation({
//     mutationFn: (data) => saveClient(data)
// })

// export const useClientDeleteMutation = () => useMutation({
//     mutationFn: (data) => deleteClient(data)
// })