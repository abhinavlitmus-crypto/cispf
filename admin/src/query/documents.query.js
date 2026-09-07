import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_DOCUMENT_LIST} from "../constants/query.constants";
import {deleteDocuments,listDocuments,saveDocuments} from "../handlers/documents.handler";


export const useGetDocumentsQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_DOCUMENT_LIST, { ...qData, total: null }],
        queryFn: () => listDocuments(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useDocumentsSaveMutation = () => useMutation({
    mutationFn: (data) => saveDocuments(data)
})

export const useDocumentsDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteDocuments(data)
})