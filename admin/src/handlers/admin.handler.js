import axiosInstance from "../utils/axios";

export const login = async (data) => {
    return await axiosInstance({
        method: 'post',
        url: `/login`,
        data: data,
    });
}

export const updateProfile = async (data) => {
    return await axiosInstance({
        method: 'post',
        url: `/save-profile`,
        data: data,
    });
}

export const updatePassword = async (data) => {
    return await axiosInstance({
        method: 'post',
        url: `/update-password`,
        data: data,
    });
}

export const validateToken = async (data) => {
    return await axiosInstance({
        method: 'post',
        url: `../validate-token`,
        data: data,
    });
}







export const adminProfile = (qData) => {
    return axiosInstance({
        method: 'get',
        url: '/profile',
        params: {
            ...qData
        }
    });
}


// sub-admin-api-routes


export const listSubAdmin = (qData) => {
    return axiosInstance({
        method: 'get',
        url: '/sub-admin/list',
        params: {
            ...qData
        }
    });
}

export const saveSubAdmin = (data) => {
    return axiosInstance({
        method: 'post',
        url: '/sub-admin/save',
        data
    });
}
export const deleteSubAdmin = (data) => {
    return axiosInstance({
        method: 'post',
        url: '/sub-admin/delete',
        data
    });

}