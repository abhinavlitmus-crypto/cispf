import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_CLIENT_LIST} from "../constants/query.constants";
import {deleteClient,listClient,saveClient} from "../handlers/client.handler";



export const useGetClientQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_CLIENT_LIST, { ...qData, total: null }],
        queryFn: () => listClient(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useClientSaveMutation = () => useMutation({
    mutationFn: (data) => saveClient(data)
})

export const useClientDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteClient(data)
})