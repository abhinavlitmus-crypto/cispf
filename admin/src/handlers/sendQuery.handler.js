import axiosInstance from "../utils/axios";

const BASE_URL = 'send-query'

export const saveSendQuery = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}



