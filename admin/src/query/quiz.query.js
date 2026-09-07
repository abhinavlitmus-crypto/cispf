import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_QUIZ_KEY} from "../constants/query.constants";
import {  deleteQuiz, listQuiz,saveQuiz} from "../handlers/quiz.handler";



export const useGetQuizQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_QUIZ_KEY, { ...qData, total: null }],
        queryFn: () => listQuiz(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useQuizSaveMutation = () => useMutation({
    mutationFn: (data) => saveQuiz(data)
})

export const useQuizDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteQuiz(data)
})