import axiosInstance from "../utils/axios";

const BASE_URL = 'consent'

export const sentConsent = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/sent',
        data
    });
}


export const validateConsent = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/validate',
        data
    });
}


