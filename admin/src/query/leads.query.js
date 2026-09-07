import {  useQuery } from "@tanstack/react-query";
import {  QUERY_ENQUIRY_KEY} from "../constants/query.constants";
import { listLeads } from "../handlers/leads.handler";

export const useGetLeadsQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_ENQUIRY_KEY, { ...qData, total: null }],
        queryFn: () => listLeads(qData),
        keepPreviousData: true,
        retry: 3
    });
}

// export const useInstituteSaveMutation = () => useMutation({
//     mutationFn: (data) => saveInstitute(data)
// })

// export const useInstituteDeleteMutation = () => useMutation({
//     mutationFn: (data) => deleteInstitute(data)
// })