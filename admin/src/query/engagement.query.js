import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_ENGAGEMENT_LIST} from "../constants/query.constants";
import {deleteEnagement,listEnagement,saveEnagement,detailsEnagement,saveTesting} from "../handlers/enagement.handler";



export const useGetEnagementQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_ENGAGEMENT_LIST, { ...qData, total: null }],
        queryFn: () => listEnagement(qData),
        keepPreviousData: true,
        retry: 3
    });
}
// example
export const useDetailsEnagementQuery = (qData, options = {}) =>
  useQuery({
    queryKey: [QUERY_ENGAGEMENT_LIST, qData],
    queryFn: () => detailsEnagement(qData),
    ...options,
  });

// export const useDetailsEnagementQuery = (qData) => {
//     return useQuery({
//         queryKey: [QUERY_ENGAGEMENT_LIST, { ...qData, total: null }],
//         queryFn: () => detailsEnagement(qData),
//         keepPreviousData: true,
//         retry: 3
//     });
// }



export const useEnagementSaveMutation = () => useMutation({
    mutationFn: (data) => saveEnagement(data)
})
export const useTestingSaveMutation = () => useMutation({
    mutationFn: (data) => saveTesting(data)
})

export const useEnagementDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteEnagement(data)
})

