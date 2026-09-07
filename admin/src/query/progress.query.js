import { useQuery } from "@tanstack/react-query";
import { QUERY_PROGRESS_KEY } from "../constants/query.constants";
import { getUserProgress } from "../handlers/progress.handler";

export const useGetUserProgressQuery = (userId) => {
    return useQuery({
        queryKey: [QUERY_PROGRESS_KEY, userId],
        queryFn: () => getUserProgress(userId),
        enabled: !!userId,
        retry: 1,
    });
}
