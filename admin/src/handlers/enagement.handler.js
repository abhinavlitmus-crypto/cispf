import axiosInstance from "../utils/axios";

const BASE_URL = 'testing'

export const saveEnagement = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/saveEngagement',
        data
    });
}
export const saveTesting = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/saveTest',
        data
    });
}
export const deleteEnagement = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listEnagement = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

export const detailsEnagement = (qData) => {
    const id  = qData.ids;
    return axiosInstance({
        method: 'get',
        url: BASE_URL + `/details/${id}`,
        // params: {
        //    id
        // }
    });
}

