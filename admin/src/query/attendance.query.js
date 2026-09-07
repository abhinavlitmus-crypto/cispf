import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_ATTENDANCE_KEY} from "../constants/query.constants";
import {deletePunch,listPunch,savePunch} from "../handlers/attendance.handler";

export const useGetAttendanceQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_ATTENDANCE_KEY, { ...qData, total: null }],
        queryFn: () => listPunch(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useAttendanceSaveMutation = () => useMutation({
    mutationFn: (data) => savePunch(data)
})

export const useAttendanceDeleteMutation = () => useMutation({
    mutationFn: (data) => deletePunch(data)
})