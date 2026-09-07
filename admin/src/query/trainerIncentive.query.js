import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_TRAINER_INCENTIVE_QUERY} from "../constants/query.constants";
import {deleteTrainerIncentive,detailsTrainerIncentive,listTrainerIncentive,saveTrainerIncentive} from "../handlers/trainerIncentive.handler";



export const useGetTrainerIncentiveQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_TRAINER_INCENTIVE_QUERY, { ...qData, total: null }],
        queryFn: () => listTrainerIncentive(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useTrainerIncentiveSaveMutation = () => useMutation({
    mutationFn: (data) => saveTrainerIncentive(data)
})

export const useTrainerIncentiveDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteTrainerIncentive(data)
})