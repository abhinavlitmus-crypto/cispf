import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_COURSE_KEY } from "../constants/query.constants";
import {  deleteCourse, listCourse,saveCourse} from "../handlers/course.handler";



export const useGetCourseQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_COURSE_KEY, { ...qData, total: null }],
        queryFn: () => listCourse(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useCourseSaveMutation = () => useMutation({
    mutationFn: (data) => saveCourse(data)
})

export const useCourseDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteCourse(data)
})