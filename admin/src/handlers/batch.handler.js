import axiosInstance from "../utils/axios";

const BASE_URL = 'batch'


export const saveBatch = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deleteBatch = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listBatch = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

export const detailsBatch = (qData) => {
    const id  = qData.ids;
    return axiosInstance({
        method: 'get',
        url: BASE_URL + `/details/${id}`,
        // params: {
        //    id
        // }
    });
}
