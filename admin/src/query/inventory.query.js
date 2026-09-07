import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_INVENTORY_LIST} from "../constants/query.constants";
import {deleteInventory,listInventory,saveInventory} from "../handlers/inventory.handler";



export const useGetInventoryQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_INVENTORY_LIST, { ...qData, total: null }],
        queryFn: () => listInventory(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useInventorySaveMutation = () => useMutation({
    mutationFn: (data) => saveInventory(data)
})

export const useInventoryDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteInventory(data)
})