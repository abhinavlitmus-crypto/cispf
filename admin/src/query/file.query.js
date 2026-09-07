import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_FILE_KEY } from "../constants/query.constants";
import { save, getFile, remove } from "../handlers/file.handler";

export const useGetFuelQuery = (url) => {
    return useQuery({
        queryKey: [QUERY_FILE_KEY],
        queryFn: () => getFile(url),
    });
}

export const useFileSaveMutation = () => useMutation({
    mutationFn: (data) => save(data)
})

export const useFileDeleteMutation = () => useMutation({
    mutationFn: (data) => remove(data)
})