import axiosInstance from "../utils/axios";

const BASE_URL = 'incentives'


export const saveIncentives = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deleteIncentives = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listIncentives = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

export const detailsIncentives = (qData) => {
    const id  = qData.ids;
    return axiosInstance({
        method: 'get',
        url: BASE_URL + `/details/${id}`,
        // params: {
        //    id
        // }
    });
}

