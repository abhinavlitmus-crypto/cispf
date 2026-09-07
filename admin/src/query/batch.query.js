import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_BATCH_QUERY} from "../constants/query.constants";
import {deleteBatch,detailsBatch,listBatch,saveBatch} from "../handlers/batch.handler";



export const useGetBatchQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_BATCH_QUERY, { ...qData, total: null }],
        queryFn: () => listBatch(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useBatchSaveMutation = () => useMutation({
    mutationFn: (data) => saveBatch(data)
})

export const useBatchDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteBatch(data)
})