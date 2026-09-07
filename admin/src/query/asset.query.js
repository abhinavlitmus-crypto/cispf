import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_ASSET_LIST} from "../constants/query.constants";
import {deleteAsset,listAsset,saveAsset} from "../handlers/asset.handler";


export const useGetAssetQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_ASSET_LIST, { ...qData, total: null }],
        queryFn: () => listAsset(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useAssetSaveMutation = () => useMutation({
    mutationFn: (data) => saveAsset(data)
})

export const useAssetDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteAsset(data)
})