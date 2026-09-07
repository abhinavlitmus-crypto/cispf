import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_BLOG_KEY } from "../constants/query.constants";
import { deleteBlog, listBlog, saveBlog } from "../handlers/blog.handler";

export const useGetBlogsQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_BLOG_KEY, { ...qData }],
        queryFn: () => listBlog(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useBlogSaveMutation = () => useMutation({
    mutationFn: (data) => saveBlog(data)
})

export const useBlogDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteBlog(data)
})