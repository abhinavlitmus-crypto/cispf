import { useMutation, useQuery } from "@tanstack/react-query";
import {saveSendQuery} from "../handlers/sendQuery.handler";

export const useSendQueryMutation = () => useMutation({
    mutationFn: (data) => saveSendQuery(data)
})

