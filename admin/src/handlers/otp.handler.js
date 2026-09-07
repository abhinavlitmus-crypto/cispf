import axiosInstance from "../utils/axios";

const BASE_URL = 'otp'


export const sendOTP = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/send',
        data
    });
}
export const verifyOTP = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/validate',
        data
    });
}





