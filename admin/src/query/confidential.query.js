import { useMutation, useQuery } from "@tanstack/react-query";

import {  QUERY_CONFIDENTIAL_LIST} from "../constants/query.constants";

import {listConfidential,saveConfidential } from "../handlers/confidential.handler";

export const useGetConfidentialQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_CONFIDENTIAL_LIST, { ...qData, total: null }],
        queryFn: () => listConfidential(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useConfidentialSaveMutation = () => useMutation({
    mutationFn: (data) => saveConfidential(data)
})

// export const useConfidentialDeleteMutation = () => useMutation({
//     mutationFn: (data) => deleteConfidential(data)
// })