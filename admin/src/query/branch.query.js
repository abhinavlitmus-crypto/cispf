import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_BRANCH_LIST} from "../constants/query.constants";
import {deleteBranch,listBranch,saveBranch} from "../handlers/branch.handler";

export const useGetBranchQuery = (qData) => {
    console.log("qData in query", qData);
    return useQuery({
        queryKey: [QUERY_BRANCH_LIST, { ...qData, total: null }],
        queryFn: () => listBranch(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useBranchSaveMutation = () => useMutation({
    mutationFn: (data) => saveBranch(data)
})

export const useBranchDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteBranch(data)
})