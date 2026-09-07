import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_MANAGEMENT_LIST} from "../constants/query.constants";
import {deleteManagement,listManagement,saveManagement} from "../handlers/management.handler";



export const useGetManagementQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_MANAGEMENT_LIST, { ...qData, total: null }],
        queryFn: () => listManagement(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useManagementSaveMutation = () => useMutation({
    mutationFn: (data) => saveManagement(data)
})

export const useManagementDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteManagement(data)
})