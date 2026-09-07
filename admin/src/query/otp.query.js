import { useMutation, useQuery } from "@tanstack/react-query";
import {sendOTP,verifyOTP} from "../handlers/otp.handler";


export const useOTPSentMutation = () => useMutation({
    mutationFn: (data) => sendOTP(data)
})
export const useOTPVerifyMutation = () => useMutation({
    mutationFn: (data) => verifyOTP(data)
})


// export const useConsentValidateMutation = () => useMutation({
//     mutationFn: (data) => validateConsent(data)
// })

