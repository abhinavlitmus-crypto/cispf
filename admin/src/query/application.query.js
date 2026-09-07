import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_APPLICATION_KEY } from "../constants/query.constants";
import { deleteApplication, listApplication, saveApplication } from "../handlers/application.handler";

export const useGetApplicationsQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_APPLICATION_KEY],
        queryFn: () => listApplication(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useApplicationSaveMutation = () => useMutation({
    mutationFn: (data) => saveApplication(data)
})

export const useApplicationDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteApplication(data)
})