import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_INSTITUTE_LIST} from "../constants/query.constants";
import { deleteInstitute,saveInstitute,listInstitute } from "../handlers/institute.handler";

export const useGetInstituteQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_INSTITUTE_LIST, { ...qData, total: null }],
        queryFn: () => listInstitute(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useInstituteSaveMutation = () => useMutation({
    mutationFn: (data) => saveInstitute(data)
})

export const useInstituteDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteInstitute(data)
})