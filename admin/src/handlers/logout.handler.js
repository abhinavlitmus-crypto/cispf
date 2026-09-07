import axiosInstance from "../utils/axios";

const BASE_URL = 'punch'
export const savePunch = (data) => {
    console.log("handler data of the logout functionality", data);
    return axiosInstance({
        method: 'post',
        url: BASE_URL+'/logout',
        data
    });
}
// export const savePunch = (data) => {
//     return axiosInstance({
//         method: 'post',
//         url: BASE_URL + '/save',
//         data
//     });
// }
// export const deletePunch = (data) => {
//     return axiosInstance({
//         method: 'post',
//         url: BASE_URL + '/delete',
//         data
//     });
// }

// export const listPunch = (qData) => {
//     return axiosInstance({
//         method: 'get',
//         url: BASE_URL + '/list',
//         params: {
//             ...qData
//         }
//     });
// }

