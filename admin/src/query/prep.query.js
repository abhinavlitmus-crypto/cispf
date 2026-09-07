import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_PREP_LIST} from "../constants/query.constants";
import {deletePrep,listPrep,savePrep} from "../handlers/prep.handler";



export const useGetPrepQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_PREP_LIST, { ...qData, total: null }],
        queryFn: () => listPrep(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const usePrepSaveMutation = () => useMutation({
    mutationFn: (data) => savePrep(data)
})

export const usePrepDeleteMutation = () => useMutation({
    mutationFn: (data) => deletePrep(data)
})