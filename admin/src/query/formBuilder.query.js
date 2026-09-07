import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_FORM_BUILDER_KEY } from "../constants/query.constants";
import { deleteFormBuilder, detailsFormBuilder, listFormBuilder, saveFormBuilder } from "../handlers/formBuilder.handler";

export const useGetFormBuilderQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_FORM_BUILDER_KEY, { ...qData, total: null }],
        queryFn: () => listFormBuilder(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useGetFormBuilderDetailsQuery = (_id) => {
    return useQuery({
        queryKey: [QUERY_FORM_BUILDER_KEY, "details", _id],
        queryFn: () => detailsFormBuilder(_id),
        enabled: !!_id,
        retry: 3
    });
}

export const useFormBuilderSaveMutation = () => useMutation({
    mutationFn: (data) => saveFormBuilder(data)
})

export const useFormBuilderDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteFormBuilder(data)
})
