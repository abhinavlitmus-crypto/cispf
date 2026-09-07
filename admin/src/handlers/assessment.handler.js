import axiosInstance from "../utils/axios";

const BASE_URL = 'assessment'

export const saveAssessment = (data) => {
    return axiosInstance({ method: 'post', url: BASE_URL + '/save', data });
}
export const deleteAssessment = (data) => {
    return axiosInstance({ method: 'post', url: BASE_URL + '/delete', data });
}
export const listAssessment = (qData) => {
    return axiosInstance({ method: 'get', url: BASE_URL + '/list', params: { ...qData } });
}
export const detailsAssessment = (_id) => {
    return axiosInstance({ method: 'get', url: BASE_URL + '/details/' + _id });
}
