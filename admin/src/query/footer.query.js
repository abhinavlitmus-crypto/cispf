import { useMutation, useQuery } from "@tanstack/react-query";
import {   QUERY_Footer_LIST} from "../constants/query.constants";
import {deleteFooter,listFooter,saveFooter } from "../handlers/footer.handler";

export const useGetFooterQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_Footer_LIST, { ...qData, total: null }],
        queryFn: () => listFooter(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useFooterSaveMutation = () => useMutation({
    mutationFn: (data) => saveFooter(data)
})

export const useFooterDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteFooter(data)
})