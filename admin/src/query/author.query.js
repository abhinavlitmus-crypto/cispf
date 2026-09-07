import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_AUTHOR_KEY } from "../constants/query.constants";
import { deleteAuthor, listAuthor, saveAuthor } from "../handlers/author.handler";

export const useGetAuthorsQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_AUTHOR_KEY, { ...qData, total: null }],
        queryFn: () => listAuthor(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useAuthorSaveMutation = () => useMutation({
    mutationFn: (data) => saveAuthor(data)
})

export const useAuthorDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteAuthor(data)
})