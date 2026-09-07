import axiosInstance from "../utils/axios";

const BASE_URL = 'blog'

export const saveBlog = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/save',
        data
    });
}
export const deleteBlog = (data) => {
    return axiosInstance({
        method: 'post',
        url: BASE_URL + '/delete',
        data
    });
}

export const listBlog = (qData) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/list',
        // params: {
        //     ...qData
        // }
    });
}

