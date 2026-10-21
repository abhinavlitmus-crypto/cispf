import axiosInstance from "../utils/axios";

const BASE_URL = 'newsletter'

export const saveNewsletter = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deleteNewsletter = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listNewsletter = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

export const previewNewsletter = (_id) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/preview' + (_id ? '/' + _id : ''),
    });
}

export const sendNewsletter = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/send',
        data
    });
}
