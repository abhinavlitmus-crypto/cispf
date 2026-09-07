import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_USER_KEY } from "../constants/query.constants";
import { deleteUser,listUser,saveUser } from "../handlers/user.handler";



export const useGetUserQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_USER_KEY, { ...qData, total: null }],
        queryFn: () => listUser(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useUserSaveMutation = () => useMutation({
    mutationFn: (data) => saveUser(data)
})

export const useUserDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteUser(data)
})