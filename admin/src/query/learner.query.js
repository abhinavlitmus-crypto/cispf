import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_LEARNER_QUERY} from "../constants/query.constants";
import {deleteLearner,listLearner,saveLearner,detailsLearner} from "../handlers/learner.handler";



export const useGetLearnerQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_LEARNER_QUERY, { ...qData, total: null }],
        queryFn: () => listLearner(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useLearnerSaveMutation = () => useMutation({
    mutationFn: (data) => saveLearner(data)
})

export const useLearnerDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteLearner(data)
})