import axiosInstance from "../utils/axios";

const BASE_URL = 'form-builder'

export const saveFormBuilder = (data) => {
    return axiosInstance({ method: 'post', url: BASE_URL + '/save', data });
}
export const deleteFormBuilder = (data) => {
    return axiosInstance({ method: 'post', url: BASE_URL + '/delete', data });
}
export const listFormBuilder = (qData) => {
    return axiosInstance({ method: 'get', url: BASE_URL + '/list', params: { ...qData } });
}
export const detailsFormBuilder = (_id) => {
    return axiosInstance({ method: 'get', url: BASE_URL + '/details/' + _id });
}
