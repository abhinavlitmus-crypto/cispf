import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_LOGOUT_KEY} from "../constants/query.constants";
import {savePunch} from "../handlers/logout.handler";

// export const useGetLogoutQuery = (qData) => {
//     return useQuery({
//         queryKey: [QUERY_LOGOUT_KEY, { ...qData, total: null }],
//         queryFn: () => listPunch(qData),
//         keepPreviousData: true,
//         retry: 3
//     });
// }

export const useLogoutSaveMutation = () => useMutation({
    mutationFn: (data) => savePunch(data)
})

// export const useLogoutDeleteMutation = () => useMutation({
//     mutationFn: (data) => deletePunch(data)
// })