import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_COURSE_TYPE_KEY} from "../constants/query.constants";
import {deleteCourseType,listCourseType,saveCourseType } from "../handlers/courseType.handler";

export const useGetCourseTypeQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_COURSE_TYPE_KEY, { ...qData, total: null }],
        queryFn: () => listCourseType(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useCourseTypeSaveMutation = () => useMutation({
    mutationFn: (data) => saveCourseType(data)
})

export const useCourseTypeDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteCourseType(data)
})