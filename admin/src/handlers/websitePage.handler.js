import axiosInstance from "../utils/axios";

const BASE_URL = 'website-page'

export const saveWebsitePage = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deleteWebsitePage = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listWebsitePage = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}
