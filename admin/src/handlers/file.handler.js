import axiosInstance from "../utils/axios";

const BASE_URL = 'file'

export const getFile = (url) => {
    return axiosInstance({
        method: 'get',
        url: "../" + url
    });
}

export const remove = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/remove',
        data
    });
}

export const save = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data
    });
}

