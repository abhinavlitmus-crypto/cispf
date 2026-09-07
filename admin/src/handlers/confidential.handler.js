import axiosInstance from "../utils/axios";

const BASE_URL = 'confidential'

export const saveConfidential = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
// export const deleteConfidential = (data) => {
//     return axiosInstance({
//         method: 'post',
//         url: BASE_URL + '/delete',
//         data
//     });
// }

export const listConfidential = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

