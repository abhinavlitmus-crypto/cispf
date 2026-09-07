import axiosInstance from "../utils/axios";

const BASE_URL = 'listing'

export const saveListing = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deleteListing = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listListing = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

