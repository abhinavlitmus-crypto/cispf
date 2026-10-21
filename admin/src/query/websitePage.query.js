import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_WEBSITE_PAGE_KEY } from "../constants/query.constants";
import { deleteWebsitePage, listWebsitePage, saveWebsitePage } from "../handlers/websitePage.handler";

export const useGetWebsitePageQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_WEBSITE_PAGE_KEY, { ...qData, total: null }],
        queryFn: () => listWebsitePage(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useWebsitePageSaveMutation = () => useMutation({
    mutationFn: (data) => saveWebsitePage(data)
})

export const useWebsitePageDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteWebsitePage(data)
})
