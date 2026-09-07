import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_TRAINER_QUERY} from "../constants/query.constants";
import {deleteTrainer,listTrainer,saveTrainer,detailsTrainer} from "../handlers/trainer.handler";



export const useGetTrainerQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_TRAINER_QUERY, { ...qData, total: null }],
        queryFn: () => listTrainer(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useTrainerSaveMutation = () => useMutation({
    mutationFn: (data) => saveTrainer(data)
})

export const useTrainerDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteTrainer(data)
})