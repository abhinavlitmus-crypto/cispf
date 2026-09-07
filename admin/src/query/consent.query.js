import { useMutation, useQuery } from "@tanstack/react-query";
import {sentConsent,validateConsent} from "../handlers/consent.handler";


export const useConsentSentMutation = () => useMutation({
    mutationFn: (data) => sentConsent(data)
})


export const useConsentValidateMutation = () => useMutation({
    mutationFn: (data) => validateConsent(data)
})

