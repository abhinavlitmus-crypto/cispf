import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_LISTING } from "../constants/query.constants";
import { deleteListing,listListing,saveListing} from "../handlers/listing.handler";

export const useGetBListingQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_LISTING, { ...qData, total: null }],
        queryFn: () => listListing(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useListingSaveMutation = () => useMutation({
    mutationFn: (data) => saveListing(data)
})

export const useListingDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteListing(data)
})