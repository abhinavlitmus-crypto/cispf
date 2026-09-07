import axiosInstance from "../utils/axios";

const BASE_URL = 'progress'

export const getUserProgress = (userId) => {
    return axiosInstance({
        method: 'get',
        url: BASE_URL + '/user/' + userId,
    });
}
