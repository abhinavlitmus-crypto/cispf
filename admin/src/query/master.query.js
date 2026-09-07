import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_ART_LIST} from "../constants/query.constants";
import {listMaster} from "../handlers/master.handler";


export const useGetMasterQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_ART_LIST, { ...qData, total: null }],
        queryFn: () => listMaster(qData),
        keepPreviousData: true,
        retry: 3
    });
}

// export const useArtSaveMutation = () => useMutation({
//     mutationFn: (data) => saveArt(data)
// })

// export const useArtDeleteMutation = () => useMutation({
//     mutationFn: (data) => deleteArt(data)
// })