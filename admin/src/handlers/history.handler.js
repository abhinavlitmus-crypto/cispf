import axiosInstance from "../utils/axios";

const BASE_URL = 'history'

// export const saveBranch = (data) => {
//     return axiosInstance({
//         method: 'post',
//         url: BASE_URL + '/save',
//         data
//     });
// }
// export const deleteBranch = (data) => {
//     return axiosInstance({
//         method: 'post',
//         url: BASE_URL + '/delete',
//         data
//     });
// }

export const listHistory = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        params: {
            ...qData
        }
    });
}

