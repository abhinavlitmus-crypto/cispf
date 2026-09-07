import { useMutation, useQuery } from "@tanstack/react-query";
import {  QUERY_CITY_LIST} from "../constants/query.constants";
import {deleteCity,listCity,saveCity } from "../handlers/city.handler";

export const useGetCityQuery = (qData) => {
    return useQuery({
        queryKey: [QUERY_CITY_LIST, { ...qData, total: null }],
        queryFn: () => listCity(qData),
        keepPreviousData: true,
        retry: 3
    });
}

export const useCitySaveMutation = () => useMutation({
    mutationFn: (data) => saveCity(data)
})

export const useCityDeleteMutation = () => useMutation({
    mutationFn: (data) => deleteCity(data)
})