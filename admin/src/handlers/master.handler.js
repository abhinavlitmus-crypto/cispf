import axiosInstance from "../utils/axios";

const BASE_URL = 'master'



export const listMaster = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

