import axiosInstance from "../utils/axios";

const BASE_URL = 'offline-coaching'

export const saveofflineCoaching = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deleteofflineCoaching = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listofflineCoaching = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

