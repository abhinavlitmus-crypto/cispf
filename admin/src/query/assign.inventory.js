import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_ASSIGN_INVENTORY_LIST} from "../constants/query.constants";
import {deleteAssignInventory,saveAssignInventory,listAssignInventory} from "../handlers/assign.inventory.handler";



export const useGetAssignInventoryQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_ASSIGN_INVENTORY_LIST, { ...qData, total: null }],
        queryFn: () => listAssignInventory(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useAssignInventorySaveMutation = () => useMutation({
    mutationFn: (data) => saveAssignInventory(data)
})

export const useAssignInventoryDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteAssignInventory(data)
})