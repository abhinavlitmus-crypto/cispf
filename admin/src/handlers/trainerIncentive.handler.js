import axiosInstance from "../utils/axios";

const BASE_URL = 'trainer-incentive'


export const saveTrainerIncentive = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deleteTrainerIncentive = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listTrainerIncentive = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

export const detailsTrainerIncentive = (qData) => {
    const id  = qData.ids;
    return axiosInstance({
        method: 'get',
        url: BASE_URL + `/details/${id}`,
        // params: {
        //    id
        // }
    });
}
