import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_SUB_ADMIN_KEY } from "../constants/query.constants";
import { adminProfile, deleteSubAdmin, listSubAdmin, login, saveSubAdmin, updatePassword, updateProfile, validateToken } from "../handlers/admin.handler";

export const useLoginMutation = () => useMutation({
    mutationFn: (data) => login(data)
});

export const useValidateTokenMutation = () => useMutation({
    mutationFn: () => validateToken()
});


export const useUpdateAdminProfileMutation = () => useMutation({
    mutationFn: (data) => updateProfile(data)
});

export const useUpdateAdminPasswordMutation = () => useMutation({
    mutationFn: (data) => updatePassword(data)
});


export const useGetAdminProfileQuery = (qData) => {
    return useQuery({
        queryKey: ['admin', { ...qData, total: null }],
        queryFn: () => adminProfile(qData),
        retry: 3
    });
}

// SUB ADMIN:
export const useGetSubAdminsQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_SUB_ADMIN_KEY, { ...qData, total: null }],
        queryFn: () => listSubAdmin(qData),
        retry: 3
    });
}

export const useSubAdminSaveMutation = () => useMutation({
    mutationFn: (data) => saveSubAdmin(data)
})

export const useSubAdminDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteSubAdmin(data)
})
