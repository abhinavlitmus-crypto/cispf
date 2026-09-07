import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_INCENTIVES_QUERY} from "../constants/query.constants";
import {deleteIncentives,detailsIncentives,listIncentives,saveIncentives} from "../handlers/incentives.handler";



export const useGetIncentivesQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_INCENTIVES_QUERY, { ...qData, total: null }],
        queryFn: () => listIncentives(qData),
        keepPreviousData: true,
        retry: 3
    });
}
export const useGetIncentiveDetailQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_INCENTIVES_QUERY, { ...qData, total: null }],
        queryFn: () => detailsIncentives(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useIncentivesSaveMutation = () => useMutation({
    mutationFn: (data) => saveIncentives(data)
})

export const useIncentivesDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteIncentives(data)
})