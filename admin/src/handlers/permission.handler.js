import axiosInstance from "../utils/axios";

const BASE_URL = 'permissions'

export const savePermission = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deletePermission = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listPermission = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

export const approvePermission = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/approve',
        data
    });
}

