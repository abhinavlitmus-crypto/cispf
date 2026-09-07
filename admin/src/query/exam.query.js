import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_EXAM_LIST} from "../constants/query.constants";
import {deleteExam,listExam,saveExam } from "../handlers/exam.handler";

export const useGetAExamQuery = (qData) => {
    console.log("querydata",qData)
    return useQuery({
        queryKey: [QUERY_EXAM_LIST, { ...qData, total: null }],
        queryFn: () => listExam(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useExamMutation = () => useMutation({
    mutationFn: (data) => saveExam(data)
})

export const useExamDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteExam(data)
})