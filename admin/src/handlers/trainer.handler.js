import axiosInstance from "../utils/axios";

const BASE_URL = 'trainer'


export const saveTrainer = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deleteTrainer = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listTrainer = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

export const detailsTrainer = (qData) => {
    const id  = qData.ids;
    return axiosInstance({
        method: 'get',
        url: BASE_URL + `/details/${id}`,
        // params: {
        //    id
        // }
    });
}

