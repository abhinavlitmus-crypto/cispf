import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_NEWSLETTER_KEY } from "../constants/query.constants";
import { deleteNewsletter, listNewsletter, previewNewsletter, saveNewsletter, sendNewsletter } from "../handlers/newsletter.handler";

export const useGetNewsletterQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_NEWSLETTER_KEY, { ...qData, total: null }],
        queryFn: () => listNewsletter(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useNewsletterSaveMutation = () => useMutation({
    mutationFn: (data) => saveNewsletter(data)
})

export const useNewsletterDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteNewsletter(data)
})

export const useNewsletterPreviewMutation = () => useMutation({
    mutationFn: (_id) => previewNewsletter(_id)
})

export const useNewsletterSendMutation = () => useMutation({
    mutationFn: (data) => sendNewsletter(data)
})
