import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_BENEFICIARIES_QUERY} from "../constants/query.constants";
import { deleteBeneficiaris,detailsBeneficiaris,listBeneficiaris,saveBeneficiaris} from "../handlers/beneficiaries.handler";



export const useGetBeneficiariesQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_BENEFICIARIES_QUERY, { ...qData, total: null }],
        queryFn: () => listBeneficiaris(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useBeneficiariesSaveMutation = () => useMutation({
    mutationFn: (data) => saveBeneficiaris(data)
})

export const useBeneficiariesDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteBeneficiaris(data)
})