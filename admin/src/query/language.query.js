import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_LANGUAGE_KEY} from "../constants/query.constants";
import {deleteLanguage,listLanguage,saveLanguage } from "../handlers/language.handler";

export const useGetLanguageQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_LANGUAGE_KEY, { ...qData, total: null }],
        queryFn: () => listLanguage(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useLanguageSaveMutation = () => useMutation({
    mutationFn: (data) => saveLanguage(data)
})

export const useLanguageDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteLanguage(data)
})