import { useMutation, useQuery } from "@tanstack/react-query";
import {   QUERY_HEADER_LIST} from "../constants/query.constants";
import {deleteHeader,listHeader,saveHeader } from "../handlers/header.handler";

export const useGetHeaderQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_HEADER_LIST, { ...qData, total: null }],
        queryFn: () => listHeader(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useHeaderSaveMutation = () => useMutation({
    mutationFn: (data) => saveHeader(data)
})

export const useHeaderDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteHeader(data)
})