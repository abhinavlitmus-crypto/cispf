import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_ASSESSMENT_KEY } from "../constants/query.constants";
import { deleteAssessment, listAssessment, saveAssessment } from "../handlers/assessment.handler";

export const useGetAssessmentQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_ASSESSMENT_KEY, { ...qData, total: null }],
        queryFn: () => listAssessment(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useAssessmentSaveMutation = () => useMutation({
    mutationFn: (data) => saveAssessment(data)
})

export const useAssessmentDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteAssessment(data)
})
