import { useMutation, useQuery } from "@tanstack/react-query";
import {   QUERY_YOUTUBE_LIST} from "../constants/query.constants";
import { deleteYoutube, listYoutube, saveYoutube } from "../handlers/youtube.handler";

export const useGetYoutubeQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_YOUTUBE_LIST, { ...qData, total: null }],
        queryFn: () => listYoutube(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useYoutubeMutation = () => useMutation({
    mutationFn: (data) => saveYoutube(data)
})

export const useYoutubeDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteYoutube(data)
})