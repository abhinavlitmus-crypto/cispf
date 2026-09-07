import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_PAYMENT_QUERY } from "../constants/query.constants";
import {deletePayment,detailsPayment,listPayment,savePayment} from "../handlers/payment.handler";



export const useGetPaymentQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_PAYMENT_QUERY, { ...qData, total: null }],
        queryFn: () => listPayment(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const usePaymentSaveMutation = () => useMutation({
    mutationFn: (data) => savePayment(data)
})

export const usePaymentDeleteMutation = () => useMutation({
    mutationFn: (data) => deletePayment(data)
})